import { ux } from '@cto.ai/sdk'
import { getLogo } from '../utils'

export const showPrerunMessage = async () => {
  const greetingLines = [
    `\n🚀  ${ux.colors.bgRed('CTO.ai CloudFormation Tool')} 🙌`,
    `\n💡  This Op requires an active AWS account 💡\n👋  Please make sure you set your AWS credentials within your team's secret store 👋\n🔖  Refer to the README for more details 🔖\n`,
  ]
  await ux.print(getLogo())
  await ux.print(greetingLines.join(`\n`))
}
