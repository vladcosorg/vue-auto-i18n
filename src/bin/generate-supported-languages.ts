import { join } from 'path'

import axios from 'axios'
import { config } from 'dotenv'
import { outputFile } from 'fs-extra'
import { format } from 'prettier'

config()
async function run(): Promise<void> {
  const response = await axios.get<{
    data: { languages: { language: string }[] }
  }>('https://translation.googleapis.com/language/translate/v2/languages', {
    params: new URLSearchParams({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      key: process.env.GOOGLE_API_KEY!,
    }),
  })
  const languages = response.data.data.languages.map((entry) => entry.language)
  await outputFile(
    './dist/supported-languages/google.json',
    format(JSON.stringify(languages), {
      parser: 'json-stringify',
    }),
  )
}

run().then(() => '')
