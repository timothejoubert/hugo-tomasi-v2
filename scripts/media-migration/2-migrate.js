// Step 2 of 2 for the "4 fields → 2 fields" media migration (see CLAUDE.md).
// Run this AFTER `npx prismic push` has applied the new schema (media/embed_video) and AFTER
// 1-backup.js has captured the old field values.
//
// This stages the changes as a Prismic migration RELEASE — it does NOT publish anything. Review
// the release in the Prismic dashboard (Releases) and publish it manually once you're happy with
// it, or via `writeClient.publishMigrationRelease()` (deliberately not called here).
//
// Usage: node scripts/media-migration/2-migrate.js
// Requires: PRISMIC_WRITE_TOKEN in .env (Settings → API & Security → write token, not the same as
// PRISMIC_ACCESS_TOKEN which is read-only).

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

const snapshotPath = join(process.cwd(), 'backup', 'media-migration', 'legacy-media-fields.json')
const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf-8'))

function buildEmbedUrl(providerName, videoId) {
    const platform = providerName?.toLowerCase()
    if (platform === 'youtube') return `https://www.youtube.com/watch?v=${videoId}`
    if (platform === 'vimeo') return `https://vimeo.com/${videoId}`
    return undefined
}

/** Builds the new 2-field shape from a captured legacy slot, registering an asset in the given
 * migration when a media file needs to be carried over. Returns `{}` when nothing was filled. */
function migrateSlot(migration, slot) {
    const patch = {}

    if (slot.embedVideo) {
        // Already a real Embed field — the field name/shape is unchanged, nothing to do.
    }
    else {
        const embedUrl = buildEmbedUrl(slot.providerName, slot.videoId)
        if (embedUrl) patch.embed_video = { embed_url: embedUrl }
    }

    const mediaSource = slot.internalVideo?.url ? slot.internalVideo : (slot.image?.url ? slot.image : undefined)
    if (mediaSource) {
        patch.media = { link_type: 'Media', id: migration.createAsset(mediaSource) }
    }

    return patch
}

const migration = createMigration()
let patchedCount = 0

if (snapshot.homePage) {
    const current = await readClient.getByID(snapshot.homePage.id)
    const updated = migration.updateDocument(current, current.data.title || 'Home page')
    Object.assign(updated.document.data, migrateSlot(migration, snapshot.homePage))
    patchedCount++
}

for (const page of snapshot.projectPages) {
    const current = await readClient.getByID(page.id)
    const updated = migration.updateDocument(current, current.data.title || page.uid || page.id)

    for (const { sliceIndex, items } of page.slices) {
        const slice = updated.document.data.slices[sliceIndex]
        items.forEach((slot, itemIndex) => {
            Object.assign(slice.items[itemIndex], migrateSlot(migration, slot))
        })
    }

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
