import { Questions } from '@cto.ai/sdk'
import { AWS_REGIONS } from '../constants'

export const awsCredsPrompts: Questions = [
  {
    type: 'secret',
    name: 'AWS_ACCESS_KEY_ID',
    message: '🔑  Provide your AWS Access Key ID',
  },
  {
    type: 'secret',
    name: 'AWS_SECRET_ACCESS_KEY',
    message: `🔑  Provide your AWS Secret Access Key`,
  },
]

export const awsRegionPrompt: Questions = [
  {
    type: 'autocomplete',
    name: 'AWS_DEFAULT_REGION',
    message: '🌍  Please select a region for your stack',
    choices: AWS_REGIONS
  }
]
