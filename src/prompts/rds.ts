import { ux, Question } from '@cto.ai/sdk'
import {
  DatabaseParameters,
  AnsDbUser,
  AnsDbPassword,
  AnsDbSize,
} from '../types'
import { RDS_MAX_STORAGE, RDS_MIN_STORAGE } from '../constants'

const { callOutCyan } = ux.colors

export const runRDSPrompts = async (): Promise<DatabaseParameters> => {
  const dbUserPrompt: Question = {
    type: 'input',
    name: 'dbUser',
    message: `Please enter a username for the database admin account\n${callOutCyan(
      'Maxiumum 16 alphanumeric charaters'
    )}`,
  }
  const dbPasswordPrompt: Question = {
    type: 'input',
    name: 'dbPassword',
    message: `Please enter a password for the database admin account\n${callOutCyan(
      'From 6 - 41 alphanumeric charaters'
    )}`,
  }
  const dbSizePrompt: Question = {
    type: 'input',
    name: 'dbSize',
    message: 'Please enter the size of the database (GiB)',
  }
  const { dbUser } = await ux.prompt<AnsDbUser>(dbUserPrompt)
  const { dbPassword } = await ux.prompt<AnsDbPassword>(dbPasswordPrompt)
  const { dbSize } = await ux.prompt<AnsDbSize>(dbSizePrompt)
  let dbSizeInt = parseInt(dbSize)
  while (dbSizeInt > RDS_MAX_STORAGE || dbSizeInt < RDS_MIN_STORAGE) {
    await ux.print(
      `🤔  Size of the database must be between ${RDS_MIN_STORAGE} - ${RDS_MAX_STORAGE} GiBs`
    )
    const { dbSize } = await ux.prompt<AnsDbSize>(dbSizePrompt)
    dbSizeInt = parseInt(dbSize)
  }
  return { dbUser, dbPassword, dbSizeInt }
}
