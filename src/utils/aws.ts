import { ux, sdk } from '@cto.ai/sdk'
import { awsRegionPrompt } from '../prompts'
import { AWSConfig } from '../types'

export const getAWSCreds = async (): Promise<AWSConfig> => {
  await ux.print('🔐  Please configure AWS access')

  const { AWS_ACCESS_KEY_ID } = await sdk.getSecret('AWS_ACCESS_KEY_ID')
  const { AWS_SECRET_ACCESS_KEY } = await sdk.getSecret('AWS_SECRET_ACCESS_KEY')
  const { AWS_DEFAULT_REGION } = await ux.prompt(awsRegionPrompt)

  return { AWS_DEFAULT_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY }
}
