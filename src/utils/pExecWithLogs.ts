import * as util from 'util'
import * as childProcess from 'child_process'
import { ux } from '@cto.ai/sdk'

// pExec executes commands in the shell https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
export const pExec = util.promisify(childProcess.exec)

// Use below for development/debugging
export const pExecWithLogs = async (command: string) => {
  console.log(
    ux.colors.reset.bold(`Running ${ux.colors.reset.magenta(command)}`)
  )

  const { stdout, stderr } = await pExec(command)
  if (stdout) console.log(stdout)
  if (stderr) console.error(stderr)

  return { stdout, stderr }
}
