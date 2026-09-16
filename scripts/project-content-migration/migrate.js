// Migrates the old-site content prepared in old-site-hugotomasi/projects/**/project.md into
// Prismic `project_page` documents.
//
// This stages everything as a Prismic migration RELEASE — it does NOT publish anything. Review
// the release in the Prismic dashboard (Releases) and publish it manually once you're happy with
// it, or via `writeClient.publishMigrationRelease()` (deliberately not called here).
//
// Behaviour:
// - `previousUrl` is read but never mapped to any Prismic field (redirects are handled separately,
//   see old-site-hugotomasi/redirect-plan.md).
// - A project.md whose `uid` already exists as a `project_page` document is skipped entirely
//   (never updated) — the skip is logged so it can be reconciled manually.
// - SKIP_UIDS below are skipped even though they don't exist under that exact uid yet, because
//   they map to a pre-existing document under a different uid that still needs manual review
//   (see the migration conversation). Remove an entry once that document has been reconciled.
// - `thumbnail` is uploaded as a new asset only if no asset tagged with this project's uid and
//   matching the file's exact byte size turns up in a keyword search (by filename) of the Prismic
//   media library; a freshly uploaded asset is tagged with the project's `uid`. When a match is
//   found, its existing id is reused and nothing is re-uploaded. This does one scoped request per
//   file rather than paginating the whole library, to stay under the Asset API's rate limit.
//
// Usage: node --env-file=.env scripts/project-content-migration/migrate.js
// Requires: PRISMIC_WRITE_TOKEN in .env (Settings → API & Security → write token, not the same as
// PRISMIC_ACCESS_TOKEN which is read-only).

import { createClient, createMigration, createWriteClient } from '@prismicio/client'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'

const PROJECTS_DIR = join(process.cwd(), 'old-site-hugotomasi', 'projects')
const LOCALE = 'fr-fr'

// See "Behaviour" note above — projects whose uid must not be auto-created this run.
const SKIP_UIDS = new Set([
    'teaser-electrochoc', // pre-existing document under uid `teaser-festival-electrochoc`, being reconciled manually
])

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

/** Prismic asset tags must be 3-20 characters — trims a uid to fit, preferring a word boundary. */
function toAssetTag(uid) {
    if (uid.length <= 20) return uid
    const truncated = uid.slice(0, 20)
    const lastDash = truncated.lastIndexOf('-')
    return lastDash > 3 ? truncated.slice(0, lastDash) : truncated
}

/** Turns a blank-line-separated block of text into Prismic RichText paragraph nodes. */
function toRichText(text) {
    return text
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => ({ type: 'paragraph', text: paragraph, spans: [] }))
}

/** Minimal parser for the project.md shape written for this migration (frontmatter + ## Excerpt / ## Content). */
function parseProjectMd(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!match) throw new Error('project.md missing frontmatter block')
    const [, frontmatterBlock, body] = match

    const frontmatter = {}
    const lines = frontmatterBlock.split('\n')
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.startsWith('  - ')) continue
        const keyMatch = line.match(/^([a-zA-Z]+):\s*(.*)$/)
        if (!keyMatch) continue
        const [, key, value] = keyMatch
        if (value === '') {
            // Multi-line value (only `tags` uses this shape here).
            const items = []
            for (let j = i + 1; j < lines.length && lines[j].startsWith('  - '); j++) {
                items.push(lines[j].slice(4).trim())
            }
            frontmatter[key] = items
        }
        else {
            frontmatter[key] = value === 'null' ? null : value
        }
    }

    const excerptMatch = body.match(/## Excerpt\n([\s\S]*?)(?:\n## Content\n?|$)/)
    const contentMatch = body.match(/## Content\n?([\s\S]*)$/)

    return {
        uid: frontmatter.uid,
        title: frontmatter.title,
        tags: frontmatter.tags || [],
        embed: frontmatter.embed,
        thumbnail: frontmatter.thumbnail,
        excerpt: (excerptMatch?.[1] || '').trim(),
        content: (contentMatch?.[1] || '').trim(),
    }
}

// Looks up the Prismic media library for an asset already tagged with this project's uid,
// matching on filename + exact byte size — the uid tag is what makes this safe (the same
// filename could otherwise false-match another project's asset of the same size). A single
// keyword-scoped request per file, instead of paginating the whole library, is what keeps this
// under the Asset API's rate limit (see the migration conversation — a full-library listing
// loop hit 429s).
async function findExistingAssetId(uid, filename, size) {
    const url = new URL('assets', 'https://asset-api.prismic.io/')
    url.searchParams.set('keyword', filename)
    url.searchParams.set('pageSize', '100')

    let response
    try {
        response = await fetch(url, {
            headers: {
                repository: REPOSITORY,
                authorization: `Bearer ${process.env.PRISMIC_WRITE_TOKEN}`,
            },
        })
    }
    catch (error) {
        console.warn(`  ${uid}: could not query the asset library for ${filename} (${error.message}) — uploading as new.`)
        return null
    }
    if (!response.ok) {
        console.warn(`  ${uid}: asset lookup for ${filename} responded ${response.status} — uploading as new.`)
        return null
    }

    const { items } = await response.json()
    return items?.find((asset) => asset.size === size && asset.tags?.some((tag) => tag.name === toAssetTag(uid)))?.id ?? null
}

console.log(`Fetching existing project_page documents from "${REPOSITORY}"...`)
const existingDocs = await readClient.getAllByType('project_page')
const existingUids = new Set(existingDocs.map((doc) => doc.uid))

const projectDirs = readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(PROJECTS_DIR, name, 'project.md')))

const migration = createMigration()
let toCreate = 0

for (const dirName of projectDirs) {
    const projectMdPath = join(PROJECTS_DIR, dirName, 'project.md')
    const project = parseProjectMd(readFileSync(projectMdPath, 'utf-8'))

    if (SKIP_UIDS.has(project.uid)) {
        console.log(`  skip ${project.uid}: in SKIP_UIDS (manual reconciliation pending)`)
        continue
    }
    if (existingUids.has(project.uid)) {
        console.log(`  skip ${project.uid}: project_page already exists in Prismic`)
        continue
    }

    const data = {
        title: project.title,
        excerpt: toRichText(project.excerpt),
        content: toRichText(project.content),
    }

    if (project.embed) {
        data.embed = { embed_url: project.embed }
    }

    if (project.thumbnail) {
        const thumbnailPath = join(dirname(projectMdPath), project.thumbnail)
        const filename = project.thumbnail.split('/').pop()
        const buffer = readFileSync(thumbnailPath)
        const existingAssetId = await findExistingAssetId(project.uid, filename, buffer.length)

        if (existingAssetId) {
            console.log(`  ${project.uid}: reusing existing asset for ${filename}`)
            data.main_media = { id: existingAssetId }
        }
        else {
            data.main_media = migration.createAsset(buffer, filename, { tags: [toAssetTag(project.uid)] })
        }
    }

    migration.createDocument({
        type: 'project_page',
        uid: project.uid,
        lang: LOCALE,
        tags: project.tags,
        data,
    }, project.title)

    toCreate++
}

if (toCreate === 0) {
    console.log('\nNothing to create — all project.md uids already exist in Prismic or are in SKIP_UIDS.')
    process.exit(0)
}

console.log(`\nPrepared ${toCreate} document(s) to create. Sending to Prismic (staged as a release, not published)...`)

await writeClient.migrate(migration, {
    reporter: (event) => {
        if (event.type.endsWith(':creating') || event.type.endsWith(':updating')) {
            console.log(`  ${event.type}: ${event.data.current}/${event.data.total}`)
        }
    },
})

console.log('\nDone — review the staged changes in the Prismic dashboard under Releases, then publish manually when ready.')
