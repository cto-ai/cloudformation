import { sdk } from '@cto.ai/sdk'
import { TrackingData } from '../types'

export const track = async (trackingData: TrackingData) => {
  const metadata = {
    event: `${trackingData.event}`,
    ...trackingData,
  }
  await sdk.track(['track', 'cto.ai-demo-app', 'CloudFormation'], metadata)
}
