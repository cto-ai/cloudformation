import { ux } from '@cto.ai/sdk'
import {
  getAWSCreds,
  track,
  handleSuccess,
  handleError,
  deleteStack,
  validateStackName,
  parameterSelect,
  getConfirmation,
  executeEC2Creation,
  executeRDSCreation,
  getTemplateFile,
} from './utils'
import { EC2_FILENAME, RDS_FILENAME } from './constants'
import {
  showPrerunMessage,
  getDeleteConfirmation,
  getStackName,
  cancelledPressEnterToContinue,
} from './prompts'
import { CloudFormationTemplate } from './types'

const main = async () => {
  try {
    await showPrerunMessage()
    const awsCreds = await getAWSCreds()

    const awsEnvCmdStr = `AWS_DEFAULT_REGION=${awsCreds.AWS_DEFAULT_REGION} AWS_ACCESS_KEY_ID=${awsCreds.AWS_ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=${awsCreds.AWS_SECRET_ACCESS_KEY}`

    const deleteConfirmed = await getDeleteConfirmation()
    // Flow to delete a stack. Exits process at end of if block.
    if (deleteConfirmed) {
      try {
        const trackStr = 'Selected to delete a stack'
        await track({ event: trackStr })
        await deleteStack(awsEnvCmdStr)
      } catch (err) {
        await handleError(err, 'Stack deletion failed')
      }
    }
    await track({ event: 'Selected to create a stack' })

    const { file, fileName, filePath } = await getTemplateFile()

    let stackName = await getStackName()
    const isValidStackName = await validateStackName(awsEnvCmdStr, stackName)
    while (!isValidStackName) {
      stackName = await getStackName()
    }
    await track({ event: `Chosen stack name: ${stackName}` })
    const template: CloudFormationTemplate = JSON.parse(file)

    // PROMPT FOR PARAMETER
    // Did not destructure here because there are many different parameters depending on chosen stack
    const parameters = await parameterSelect(fileName, template, awsEnvCmdStr)

    if (fileName === EC2_FILENAME && parameters.instanceType) {
      // Set params with defaults
      template.Parameters.InstanceType.Default = parameters.instanceType
      const trackStr = `Configured InstanceType default parameter of ${fileName} to ${parameters.instanceType}`
      await track({ event: trackStr })

      const confirmed = await getConfirmation(awsCreds.AWS_DEFAULT_REGION)
      if (confirmed) {
        await executeEC2Creation({
          template,
          fileName,
          parameters,
          awsEnvCmdStr,
          filePath,
          stackName,
        })
      } else {
        await ux.prompt(cancelledPressEnterToContinue)
        await handleSuccess(
          `🤔 ${stackName} has not been created due to failed confirmation`
        )
      }
    }
    if (fileName === RDS_FILENAME && parameters.dbSizeInt) {
      template.Parameters.DBAllocatedStorage.Default = parameters.dbSizeInt
      const trackStr = `Configured DBAllocatedStorage default parameter of ${fileName} to ${parameters.dbSizeInt}`
      await track({ event: trackStr })

      const confirmed = await getConfirmation(awsCreds.AWS_DEFAULT_REGION)
      if (confirmed) {
        await executeRDSCreation({
          template,
          fileName,
          parameters,
          awsEnvCmdStr,
          filePath,
          stackName,
        })
      } else {
        await ux.prompt(cancelledPressEnterToContinue)
        await handleSuccess(
          `🤔 ${stackName} has not been created due to failed confirmation`
        )
      }
    }
    await handleSuccess(`🚀  ${stackName} has been successfully created! 🚀`)
  } catch (err) {
    await handleError(err, 'CloudFormation Op did not complete.')
  }
}
main()
