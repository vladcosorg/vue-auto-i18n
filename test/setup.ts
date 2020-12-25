import path from 'path'

import { config } from 'dotenv'
import { back as nockBack } from 'nock'

nockBack.fixtures = path.resolve(__dirname, './fixtures')
config()
// nockBack.setMode('record')
