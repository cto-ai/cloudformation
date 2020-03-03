import { ux } from '@cto.ai/sdk'
import {
  AnsStackName,
  AnsStack,
  AnsConfirmed,
  AnsChosenTemplate,
} from '../types'
import { STACKNAMES } from '../constants'

const { bold, primary } = ux.colors

export const getStackName = async (): Promise<string> => {
  const { stackName } = await ux.prompt<AnsStackName>({
    type: 'input',
    name: 'stackName',
    message: `🚀  ${bold(primary('Please enter a name for you new stack'))}`,
  })
  return stackName
}

export const getDeleteStack = async (
  stackNameList: string[]
): Promise<string> => {
  const { stack } = await ux.prompt<AnsStack>({
    type: 'list',
    name: 'stack',
    message: `🚀  ${bold(primary('Which stack will be deleted'))}`,
    choices: stackNameList,
  })
  return stack
}

export const getDeleteConfirmation = async (): Promise<boolean> => {
  const { confirmed } = await ux.prompt<AnsConfirmed>({
    type: 'list',
    name: 'confirmed',
    message: `🚀  ${bold(primary('Select an operation'))}`,
    choices: ['Create a new stack', 'Delete an existing stack'],
  })

  return confirmed === 'Delete an existing stack' ? true : false
}

export const getChosenTemplate = async () => {
  const { chosenTemplate } = await ux.prompt<AnsChosenTemplate>({
    type: 'list',
    name: 'chosenTemplate',
    message: 'Please choose a stack to create',
    choices: STACKNAMES,
  })
  return chosenTemplate
}
