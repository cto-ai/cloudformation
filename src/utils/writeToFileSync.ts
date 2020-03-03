import * as fs from 'fs'
import * as path from 'path'
import { handleError } from './helpers'

export const writeToFileSync = async ({
  dirPath,
  fileName,
  data,
}: {
  dirPath: string
  fileName: string
  data: string | Buffer
}): Promise<void> => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    const filePath = path.resolve(dirPath, fileName)
    fs.writeFileSync(filePath, data, 'utf8')
  } catch (err) {
    return await handleError(err, 'Unable to write to template file!')
  }
}
