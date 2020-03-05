import * as path from 'path'
import { ux } from '@cto.ai/sdk'
import { track, pExec, writeToFileSync, readFileSync } from '../utils'
import {
  CloudFormationTemplate,
  StackParameters,
  StackSummaries,
  StackResources,
  EC2Reservation,
  DBInstances,
  FileDetails,
  StackDetails,
} from '../types'
import { EC2_FILENAME, RDS_FILENAME, TEMPLATE_DIR, FILEMAP } from '../constants'
import {
  runEC2Prompts,
  runRDSPrompts,
  getDeleteStack,
  getConfirm,
  getChosenTemplate,
} from '../prompts'

const { bold, primary, magenta, green, callOutCyan } = ux.colors

const cto_terminal = `
      [94m██████[39m[33m╗[39m [94m████████[39m[33m╗[39m  [94m██████[39m[33m╗ [39m      [94m█████[39m[33m╗[39m  [94m██[39m[33m╗[39m
     [94m██[39m[33m╔════╝[39m [33m╚══[39m[94m██[39m[33m╔══╝[39m [94m██[39m[33m╔═══[39m[94m██[39m[33m╗[39m     [94m██[39m[33m╔══[39m[94m██[39m[33m╗[39m [94m██[39m[33m║[39m
     [94m██[39m[33m║     [39m [94m   ██[39m[33m║   [39m [94m██[39m[33m║[39m[94m   ██[39m[33m║[39m     [94m███████[39m[33m║[39m [94m██[39m[33m║[39m
     [94m██[39m[33m║     [39m [94m   ██[39m[33m║   [39m [94m██[39m[33m║[39m[94m   ██[39m[33m║[39m     [94m██[39m[33m╔══[39m[94m██[39m[33m║[39m [94m██[39m[33m║[39m
     [33m╚[39m[94m██████[39m[33m╗[39m [94m   ██[39m[33m║   [39m [33m╚[39m[94m██████[39m[33m╔╝[39m [94m██[39m[33m╗[39m [94m██[39m[33m║[39m[94m  ██[39m[33m║[39m [94m██[39m[33m║[39m
     [33m ╚═════╝[39m [33m   ╚═╝   [39m [33m ╚═════╝ [39m [33m╚═╝[39m [33m╚═╝  ╚═╝[39m [33m╚═╝[39m
 We’re building the world’s best developer experiences.
 `

const cto_slack = `:white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square:
:white_square::white_square::black_square::black_square::white_square::white_square::black_square::black_square::black_square::white_square::white_square::white_square::black_square::black_square::black_square::white_square:
:white_square::black_square::white_square::white_square::black_square::white_square::black_square::white_square::white_square::black_square::white_square::black_square::white_square::white_square::white_square::white_square:
:white_square::black_square::white_square::white_square::black_square::white_square::black_square::black_square::black_square::white_square::white_square::white_square::black_square::black_square::white_square::white_square:
:white_square::black_square::white_square::white_square::black_square::white_square::black_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::black_square::white_square:
:white_square::white_square::black_square::black_square::white_square::white_square::black_square::white_square::white_square::white_square::white_square::black_square::black_square::black_square::white_square::white_square:
:white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square::white_square:`

export const getLogo = () => {
  const environment = process.env.SDK_INTERFACE_TYPE

  return environment === 'terminal' ? cto_terminal : cto_slack
}

export const handleSuccess = async (msg: string) => {
  await ux.print(msg)
  await track({
    event: `CloudFormation Op Completed`,
    msg,
  })
  process.exit()
}

export const handleError = async (err: Error, errMsg: string) => {
  await track({
    event: `Error occurred: check logs for details`,
    errMsg,
    error: `${err.name} ${err.message}`,
  })
  process.exit(1)
}

export const parameterSelect = async (
  fileName: string,
  templateFile: CloudFormationTemplate,
  awsEnvCmdStr: string
): Promise<StackParameters> => {
  switch (fileName) {
    case EC2_FILENAME:
      return await runEC2Prompts(templateFile, awsEnvCmdStr)
    case RDS_FILENAME:
      return await runRDSPrompts()
    default:
      return await handleError(
        new Error('❗️  Invalid template filename chosen!'),
        '😅  Invalid template chosen!'
      )
  }
}

export const validateTemplate = async (
  awsEnvCmdStr: string,
  file: string
): Promise<void> => {
  try {
    const cmdStr = `${awsEnvCmdStr} aws cloudformation validate-template --template-body file://${file}`
    await pExec(cmdStr)
  } catch (err) {
    await handleError(err, '❗  Failed to validate CloudFormation template!')
  }
}

const createStackEC2 = async (
  stackName: string,
  awsEnvCmdStr: string,
  file: string,
  keyPair: string
): Promise<void> => {
  const cmdStr = `${awsEnvCmdStr} aws cloudformation create-stack --stack-name ${stackName} --template-body file://${file} --parameters ParameterKey=KeyName,ParameterValue=${keyPair}`
  await ux.print('📥  Creating stack...')
  await pExec(cmdStr)
  await pExec(
    `${awsEnvCmdStr} aws cloudformation wait stack-create-complete --stack-name ${stackName}`
  )
  await track({ event: `Stack successfully created: ${stackName}` })
}

const getEC2URL = async (
  awsEnvCmdStr: string,
  stackName: string
): Promise<void> => {
  const { stdout } = await pExec(
    `${awsEnvCmdStr} aws cloudformation describe-stack-resources --stack-name ${stackName}`
  )
  const jsonStackResources: StackResources = JSON.parse(stdout)

  const instanceId = jsonStackResources.StackResources[0].PhysicalResourceId
  {
    await ux.print('📥  Fetching EC2 DNS name...')
    const { stdout } = await pExec(
      `${awsEnvCmdStr} aws ec2 describe-instances --instance-ids ${instanceId}`
    )

    const jsonEC2Reservation: EC2Reservation = JSON.parse(stdout)
    await ux.print(
      '🔗 EC2 Public DNS for your stack: ' +
        jsonEC2Reservation.Reservations[0].Instances[0].PublicDnsName
    )
    await track({
      event: `Fetched Public DNS for stack: ${stackName}`,
    })
  }
}

export const executeEC2Creation = async ({
  template,
  fileName,
  parameters: { chosenKeyPair },
  awsEnvCmdStr,
  filePath,
  stackName,
}: StackDetails) => {
  if (!chosenKeyPair) {
    const errStr = '❗️  Invalid parameters passed in for EC2 creation!'
    return await handleError(new Error(errStr), errStr)
  }

  await writeToFileSync({
    dirPath: TEMPLATE_DIR,
    data: JSON.stringify(template),
    fileName,
  })
  await validateTemplate(awsEnvCmdStr, filePath)

  await createStackEC2(stackName, awsEnvCmdStr, filePath, chosenKeyPair)
  await getEC2URL(awsEnvCmdStr, stackName)
}

export const createStackRDS = async (
  stackName: string,
  awsEnvCmdStr: string,
  file: string,
  dbUser: string,
  dbPassword: string
): Promise<void> => {
  const parametersArr = [
    { ParameterKey: 'DBUser', ParameterValue: dbUser },
    { ParameterKey: 'DBPassword', ParameterValue: dbPassword },
  ]
  const parametersJSON = JSON.stringify(parametersArr)
  await ux.print('📥  Creating stack...')
  const cmdStr = `${awsEnvCmdStr} aws cloudformation create-stack --stack-name ${stackName} --template-body file://${file} --parameters '${parametersJSON}'`
  await pExec(cmdStr)
  await pExec(
    `${awsEnvCmdStr} aws cloudformation wait stack-create-complete --stack-name ${stackName}`
  )
  await ux.print('🚀  Stack created!')
  await track({ event: `Stack successfully created: ${stackName}` })
}

const getRDSURL = async (awsEnvCmdStr: string, stackName: string) => {
  const { stdout } = await pExec(
    `${awsEnvCmdStr} aws cloudformation describe-stack-resources --stack-name ${stackName}`
  )
  const jsonStackResources: StackResources = JSON.parse(stdout)

  const instanceId = jsonStackResources.StackResources[0].PhysicalResourceId
  {
    await ux.print('📥  Fetching RDS Endpoint...')
    const { stdout } = await pExec(
      `${awsEnvCmdStr} aws rds describe-db-instances --db-instance-identifier ${instanceId}`
    )

    const trackStr = `Fetched RDS Endpoint for stack: ${stackName}`
    await track({ event: trackStr })

    const jsonDBInstances: DBInstances = JSON.parse(stdout)
    const { Address, Port } = jsonDBInstances.DBInstances[0].Endpoint
    await ux.print(
      `🎸  The RDS endpoint address and port is ${Address}:${Port}\n${callOutCyan(
        `🌎  Please refer to ${magenta(
          'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstance.html'
        )} for instructions to connect to the DB instance!
        `
      )}`
    )
  }
}

export const executeRDSCreation = async ({
  template,
  fileName,
  parameters: { dbUser, dbPassword },
  awsEnvCmdStr,
  filePath,
  stackName,
}: StackDetails) => {
  if (!dbUser || !dbPassword) {
    const errStr = '❗️  Invalid parameters passed in for RDS creation!'
    return await handleError(new Error(errStr), errStr)
  }
  await writeToFileSync({
    dirPath: TEMPLATE_DIR,
    data: JSON.stringify(template),
    fileName,
  })
  await validateTemplate(awsEnvCmdStr, filePath)

  await createStackRDS(stackName, awsEnvCmdStr, filePath, dbUser, dbPassword)
  await getRDSURL(awsEnvCmdStr, stackName)
}

export const deleteStack = async (awsEnvCmdStr: string) => {
  const cmdStr = `${awsEnvCmdStr} aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE`

  const { stdout } = await pExec(cmdStr)
  const stackList: StackSummaries = JSON.parse(stdout)

  if (stackList.StackSummaries.length < 1) {
    await ux.print('😅  Oops! You do not seem to have any stacks. Aborting!')
    await handleError(
      new Error('list-stacks: StackSummary Empty'),
      'list-stacks returned empty array'
    )
  }
  const stackNameList = stackList.StackSummaries.map(
    stackSummary => stackSummary.StackName
  )

  const stack = await getDeleteStack(stackNameList)
  await track({
    event: `Selected to delete the stack: ${stack}`,
  })

  const confirmation = await getConfirm()

  if (confirmation === 'yes') {
    const cmdStr = `${awsEnvCmdStr} aws cloudformation delete-stack --stack-name ${stack}`
    await pExec(cmdStr)
    await ux.print(`🗑️  Deleting stack: ${stack}`)
    await pExec(
      `${awsEnvCmdStr} aws cloudformation wait stack-delete-complete --stack-name ${stack}`
    )
    await track({
      event: `${stack} stack successfully deleted`,
    })
    await handleSuccess(`🔥  ${stack} stack has been deleted`)
  }
  await handleSuccess(`⬜️  ${stack} has not been deleted`)
}

export const getConfirmation = async (region: string): Promise<boolean> => {
  const createStr = `Writing to template file and Creating stack to region \`${green(
    region
  )}\``
  await ux.print(`\n🚧  ${bold(primary(createStr))} 🚧`)

  const confirmation = await getConfirm()
  if (confirmation.toLowerCase() !== 'yes') {
    return false
  }
  return true
}

export const getTemplateFile = async (): Promise<FileDetails> => {
  try {
    const chosenTemplate = await getChosenTemplate()
    await track({ event: `Selected the template: ${chosenTemplate}` })
    const fileName = FILEMAP[chosenTemplate]
    const file = await readFileSync({ dirPath: TEMPLATE_DIR, fileName })
    const filePath = path.resolve(TEMPLATE_DIR, fileName)
    if (!file) {
      throw Error('Template file does not exist.')
    }
    return { file, fileName, filePath }
  } catch (err) {
    return await handleError(err, err.message)
  }
}

export const validateStackName = async (
  awsEnvCmdStr: string,
  stackName: string
): Promise<boolean> => {
  // Note: If stack name is not taken an error will occur for the aws command
  try {
    const charValidation = stackName.match(/[^a-zA-Z0-9-]+/g)
    if (charValidation) {
      await ux.print(
        `🤔  Stack names can only contain alphanumeric and '-' characters`
      )
    } else {
      await pExec(
        `${awsEnvCmdStr} aws cloudformation describe-stacks --stack-name ${stackName}`
      )
      await ux.print(
        '😞  This stack name is taken! Please enter a different one!'
      )
    }
    return false
  } catch (err) {
    return err.message.includes('does not exist') ? true : false
  }
}
