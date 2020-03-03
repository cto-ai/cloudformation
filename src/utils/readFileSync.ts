import * as fs from 'fs'
import * as path from 'path'
import { handleError } from './helpers'

export const readFileSync = async ({
  dirPath,
  fileName,
}: {
  dirPath: string
  fileName: string
}): Promise<string> => {
  try {
    const filePath = path.resolve(dirPath, fileName)
    const file = fs.readFileSync(filePath, 'utf8')
    return file
  } catch (err) {
    return await handleError(err, 'Unable to read template file!')
  }
}
