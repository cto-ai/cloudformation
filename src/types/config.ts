import { CloudFormationTemplate, StackParameters } from './cloudFormation'

export type AWSConfig = {
  AWS_DEFAULT_REGION: string
  AWS_ACCESS_KEY_ID: string
  AWS_SECRET_ACCESS_KEY: string
}

export type FileDetails = {
  file: string
  fileName: string
  filePath: string
}

export type FileMap = {
  [key: string]: string
}

export type StackDetails = {
  template: CloudFormationTemplate
  fileName: string
  parameters: StackParameters
  awsEnvCmdStr: string
  filePath: string
  stackName: string
}
