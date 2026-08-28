// Step 2 of 2 for the "generic page fields" migration (see CLAUDE.md).
// Run this AFTER `npx prismic push` has applied the new schema and AFTER 1-backup.js has
// captured the old field values.
//
// This stages the changes as a Prismic migration RELEASE — it does NOT publish anything. Review
// the release in the Prismic dashboard (Releases) and publish it manually once you're happy with
// it, or via `writeClient.publishMigrationRelease()` (deliberately not called here).
//
// Usage: node --env-file=.env scripts/schema-migration/2-migrate.js
// Requires: PRISMIC_WRITE_TOKEN in .env (Settings → API & Security → write token).

import { createClient, createMigration, createWriteClient } from '@prismicio/client'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const config = JSON.parse(readFileSync(join(process.cwd(), 'prismic.config.json'), 'utf-8'))
const REPOSITORY = config.repositoryName

if (!process.env.PRISMIC_WRITE_TOKEN) {
	console.error('Missing PRISMIC_WRITE_TOKEN in .env — generate a write token from the Prismic dashboard (Settings → API & Security) first.')
	process.exit(1)
}

const readClient = createClient(REPOSITORY, {
	...(process.env.PRISMIC_ACCESS_TOKEN ? { accessToken: process.env.PRISMIC_ACCESS_TOKEN } : {}),
})
const writeClient = createWriteClient(REPOSITORY, {
	writeToken: process.env.PRISMIC_WRITE_TOKEN,
	...(process.env.PRISMIC_ACCESS_TOKEN ? { accessToken: process.env.PRISMIC_ACCESS_TOKEN } : {}),
})

const snapshotPath = join(process.cwd(), 'backup', 'schema-migration', 'legacy-fields.json')
const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf-8'))

const migration = createMigration()
let patchedCount = 0

// `getByID` returns whatever is still stored on the document, including fields the just-pushed
// schema no longer declares (e.g. the old `site_name`/`description`) — the Migration API rejects
// a payload containing any field not part of the current custom type, so those stale keys must
// be deleted before sending, not just have the new ones added alongside them.
if (snapshot.setting) {
	const current = await readClient.getByID(snapshot.setting.id)
	const updated = migration.updateDocument(current, 'Setting')
	delete updated.document.data.site_name
	delete updated.document.data.email
	delete updated.document.data.socials
	Object.assign(updated.document.data, {
		publisher_name: snapshot.setting.siteName,
		publisher_email: snapshot.setting.email,
		publisher_socials: snapshot.setting.socials,
	})
	patchedCount++
}

for (const page of snapshot.projectPages) {
	if (!page.description?.length) continue

	const current = await readClient.getByID(page.id)
	const updated = migration.updateDocument(current, current.data.title || page.uid || page.id)
	delete updated.document.data.description
	updated.document.data.content = page.description
	patchedCount++
}

console.log(`Prepared migration for ${patchedCount} document(s). Sending to Prismic (staged as a release, not published)...`)

await writeClient.migrate(migration, {
	reporter: (event) => {
		if (event.type.endsWith(':creating') || event.type.endsWith(':updating')) {
			console.log(`  ${event.type}: ${event.data.current}/${event.data.total}`)
		}
	},
})

console.log('\nDone — review the staged changes in the Prismic dashboard under Releases, then publish manually when ready.')
