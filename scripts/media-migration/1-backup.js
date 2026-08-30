// Step 1 of 2 for the "4 fields → 2 fields" media migration (see CLAUDE.md).
// Run this BEFORE `npx prismic push` — once the new schema (media/embed_video) is pushed, the
// live custom types no longer describe the old fields (image/internal_video/video_id/
// provider_name/embed_id/embed_platform), so this snapshot is the only reliable way to recover
// their values afterwards.
//
// Usage: node scripts/media-migration/1-backup.js
// Requires (optional): PRISMIC_ACCESS_TOKEN in .env if the repository isn't public.

import { createClient } from '@prismicio/client'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const config = JSON.parse(readFileSync(join(process.cwd(), 'prismic.config.json'), 'utf-8'))
const REPOSITORY = config.repositoryName

const client = createClient(REPOSITORY, {
    ...(process.env.PRISMIC_ACCESS_TOKEN ? { accessToken: process.env.PRISMIC_ACCESS_TOKEN } : {}),
})

function extractLegacyMediaSlot(fields) {
    return {
        image: fields.image,
        internalVideo: fields.internal_video,
        embedVideo: fields.embed_video,
        videoId: fields.video_id,
        providerName: fields.provider_name,
    }
}

const snapshot = { homePage: null, projectPages: [] }

// home_page: fields live directly on `data` (image/internal_video/embed_id/embed_platform/embed_video)
const homePage = await client.getSingle('home_page').catch(() => null)
if (homePage) {
    snapshot.homePage = {
        id: homePage.id,
        ...extractLegacyMediaSlot(homePage.data),
        // home_page used embed_id/embed_platform (not video_id/provider_name like MediaSlice)
        videoId: homePage.data.embed_id,
        providerName: homePage.data.embed_platform,
    }
}

// project_page: media_slice instances live inside data.slices, each with repeatable `items`
const projectPages = await client.getAllByType('project_page')
for (const doc of projectPages) {
    const slices = (doc.data.slices || [])
        .map((slice, sliceIndex) => ({ slice, sliceIndex }))
        .filter(({ slice }) => slice.slice_type === 'media_slice')

    if (!slices.length) continue

    snapshot.projectPages.push({
        id: doc.id,
        uid: doc.uid,
        slices: slices.map(({ slice, sliceIndex }) => ({
            sliceIndex,
            items: (slice.items || []).map(extractLegacyMediaSlot),
        })),
    })
}

const outputDir = join(process.cwd(), 'backup', 'media-migration')
mkdirSync(outputDir, { recursive: true })
const outputPath = join(outputDir, 'legacy-media-fields.json')
writeFileSync(outputPath, JSON.stringify(snapshot, null, 2), 'utf-8')

console.log(`Snapshot written to ${outputPath}`)
console.log(`  home_page: ${snapshot.homePage ? 'captured' : 'not found'}`)
console.log(`  project_page docs with a MediaSlice: ${snapshot.projectPages.length}`)
console.log('\nNext: run `npx prismic push` to push the new schema, then run 2-migrate.js.')
