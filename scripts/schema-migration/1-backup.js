// Step 1 of 2 for the "generic page fields" migration (see CLAUDE.md).
// Run this BEFORE `npx prismic push` — the renamed fields (project_page.description → content,
// setting.site_name/email/socials → publisher_*) won't be readable under their old ids once the
// new schema is live, so this snapshot is the only way to recover their values afterwards.
//
// Usage: node --env-file=.env scripts/schema-migration/1-backup.js

import { createClient } from '@prismicio/client'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const config = JSON.parse(readFileSync(join(process.cwd(), 'prismic.config.json'), 'utf-8'))
const REPOSITORY = config.repositoryName

const client = createClient(REPOSITORY, {
    ...(process.env.PRISMIC_ACCESS_TOKEN ? { accessToken: process.env.PRISMIC_ACCESS_TOKEN } : {}),
})

const snapshot = { setting: null, projectPages: [] }

const setting = await client.getSingle('setting').catch(() => null)
if (setting) {
    snapshot.setting = {
        id: setting.id,
        siteName: setting.data.site_name,
        email: setting.data.email,
        socials: setting.data.socials,
    }
}

const projectPages = await client.getAllByType('project_page')
snapshot.projectPages = projectPages.map(doc => ({
    id: doc.id,
    uid: doc.uid,
    description: doc.data.description,
}))

const outputDir = join(process.cwd(), 'backup', 'schema-migration')
mkdirSync(outputDir, { recursive: true })
const outputPath = join(outputDir, 'legacy-fields.json')
writeFileSync(outputPath, JSON.stringify(snapshot, null, 2), 'utf-8')

console.log(`Snapshot written to ${outputPath}`)
console.log(`  setting: ${snapshot.setting ? 'captured' : 'not found'}`)
console.log(`  project_page docs: ${snapshot.projectPages.length}`)
console.log('\nNext: run `npx prismic push` to push the new schema, then run 2-migrate.js.')
