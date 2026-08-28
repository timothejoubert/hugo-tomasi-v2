import * as prismic from '@prismicio/client'
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const config = JSON.parse(readFileSync(join(process.cwd(), 'prismic.config.json'), 'utf-8'))
const REPOSITORY = config.repositoryName

if (!REPOSITORY) {
	console.error('No repositoryName found in prismic.config.json')
	process.exit(1)
}

const OUTPUT_DIR = join(process.cwd(), 'backup', 'prismic')

const accessToken = process.env.PRISMIC_ACCESS_TOKEN

const client = prismic.createClient(REPOSITORY, {
	...(accessToken ? { accessToken } : {}),
})

console.log(`Fetching all documents from "${REPOSITORY}"...`)

const documents = await client.dangerouslyGetAll()

console.log(`${documents.length} documents found.`)

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const outputDir = join(OUTPUT_DIR, timestamp)

mkdirSync(outputDir, { recursive: true })

// Full dump in one file
const fullDumpPath = join(outputDir, 'all-documents.json')
writeFileSync(fullDumpPath, JSON.stringify(documents, null, 2), 'utf-8')
console.log(`Full dump: ${fullDumpPath}`)

// One file per document type
const byType = {}
for (const doc of documents) {
	if (!byType[doc.type]) byType[doc.type] = []
	byType[doc.type].push(doc)
}

for (const [type, docs] of Object.entries(byType)) {
	const typePath = join(outputDir, `${type}.json`)
	writeFileSync(typePath, JSON.stringify(docs, null, 2), 'utf-8')
	console.log(`  ${type}: ${docs.length} document(s) → ${typePath}`)
}

console.log(`\nBackup complete: ${outputDir}`)
