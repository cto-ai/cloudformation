import { ux } from '@cto.ai/sdk'
import {
  AnsChosenKeyPair,
  AnsEC2InstanceType,
  KeyPair,
  KeyPairs,
  CloudFormationTemplate,
  EC2Params,
} from '../types'
import { pExec, handleSuccess } from '../utils'

const { magenta } = ux.colors

export const ec2KeyPairPrompt = async (
  awsEnvCmdStr: string
): Promise<string> => {
  const keyPairs = await getEC2KeyPairs(awsEnvCmdStr)
  const { chosenKeyPair } = await ux.prompt<AnsChosenKeyPair>({
    type: 'autocomplete',
    name: 'chosenKeyPair',
    message: 'Please choose the EC2 keypair you would like to use',
    choices: [
      ...keyPairs.map(keyPair => keyPair.KeyName),
      'Create a new key pair',
    ],
  })
  return chosenKeyPair
}

export const getEC2KeyPairs = async (
  awsEnvCmdStr: string
): Promise<KeyPair[]> => {
  const cmdStr = `${awsEnvCmdStr} aws ec2 describe-key-pairs`
  const { stdout } = await pExec(cmdStr)
  const jsonKeyPairs: KeyPairs = JSON.parse(stdout)
  return jsonKeyPairs.KeyPairs
}

export const getEC2InstanceType = async (
  AllowedValues: CloudFormationTemplate['Parameters']['InstanceType']['AllowedValues']
): Promise<string> => {
  const { instanceType } = await ux.prompt<AnsEC2InstanceType>({
    type: 'autocomplete',
    name: 'instanceType',
    choices: AllowedValues,
    message: 'Please choose instance type',
  })

  return instanceType
}

export const runEC2Prompts = async (
  templateFile: CloudFormationTemplate,
  awsEnvCmdStr: string
): Promise<EC2Params> => {
  const chosenKeyPair = await ec2KeyPairPrompt(awsEnvCmdStr)
  if (chosenKeyPair === 'Create a new key pair') {
    await ux.print(
      `\n💻  Create a new EC2 key pair by running ${magenta(
        '$ aws ec2 create-key-pair --key-name MyKeyPair --query "KeyMaterial" --output text > MyKeyPair.pem'
      )} on your host machine. This command will pipe your private key directly into a file.`
    )
    await ux.print(
      `\n🌎  If you prefer using the web console: ${ux.url(
        'Creating a Key Pair Using Amazon EC2',
        'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair'
      )}\n`
    )
    await handleSuccess('Key Pair Creation Guide Completed')
  }

  const instanceType = await getEC2InstanceType(
    templateFile.Parameters.InstanceType.AllowedValues
  )
  return { chosenKeyPair, instanceType }
}
