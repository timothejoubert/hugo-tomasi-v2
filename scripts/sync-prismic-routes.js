import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { prismicDocumentRoutes } from '../shared/prismic-schema.ts'

const configPath = join(process.cwd(), 'prismic.config.json')
const config = JSON.parse(readFileSync(configPath, 'utf-8'))

config.routes = prismicDocumentRoutes.map(({ type, path }) => ({ type, path }))

writeFileSync(configPath, `${JSON.stringify(config, null, 4)}\n`)
