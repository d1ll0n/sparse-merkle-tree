import path = require('path')

const rootPath = __dirname
const dbRootPath = path.join(__dirname, 'db')

export * from './src/app/db'
export * from './src/types-needed'
export * from './src/utils'
export * from './src/merkle-tree'

export { rootPath, dbRootPath }