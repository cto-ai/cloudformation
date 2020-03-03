import { ux } from '@cto.ai/sdk'

export const showPrerunMessage = async () => {
  const greetingLines = [
    `\n🚀  ${ux.colors.bgRed('CTO.ai CloudFormation Tool')} 🙌\n`,
  ]

  await ux.print(greetingLines.join(`\n`))
}
