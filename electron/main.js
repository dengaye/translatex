require('ts-node').register({
  transpileOnly: true,
  project: './tsconfig.electron.json'
})

require('./main.ts')
