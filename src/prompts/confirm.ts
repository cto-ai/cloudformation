import { ux, Question } from '@cto.ai/sdk'
import { AnsConfirm } from '../types'

export const getConfirm = async (): Promise<string> => {
  const { confirmation } = await ux.prompt<AnsConfirm>({
    type: 'input',
    name: 'confirmation',
    message: `\n✅  Type \`yes\` to confirm`,
  })
  return confirmation
}

export const cancelledPressEnterToContinue: Question = {
  type: 'input',
  name: 'continue',
  message: `\nCreation was not confirmed, cancelling. Press enter to exit`,
}
