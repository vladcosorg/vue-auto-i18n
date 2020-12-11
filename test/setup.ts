import path from 'path'
import nock from 'nock'
import dotenv from 'dotenv'

nock.back.fixtures = path.resolve(__dirname, './fixtures')
dotenv.config()
