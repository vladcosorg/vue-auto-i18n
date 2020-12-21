// eslint-disable-next-line import/no-unused-modules
import { config } from 'dotenv'
import { outputFile } from 'fs-extra'
import { format } from 'prettier'
import fetch from 'node-fetch'

config()

async function run(): Promise<void> {
  const request = await fetch(
    'https://translation.googleapis.com/language/translate/v2/languages?' +
      new URLSearchParams({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        key: process.env.GOOGLE_API_KEY!,
      }),
  )
  const response = await request.json()
  const languages = response.data.languages.map(
    (entry: { language: string }) => entry.language,
  )
  await outputFile(
    './dist/supported-languages/google.json',
    format(JSON.stringify(languages), {
      parser: 'json-stringify',
    }),
  )
}

run().then(() => '')
