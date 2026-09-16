import { toRef } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { isFilled } from '@prismicio/client'
import type { EmbedField, OEmbedExtra, VideoOEmbed } from '@prismicio/client'
import { withTrailingSlash } from 'ufo'
import type { ProjectPageDocument } from '~~/prismicio-types'

interface PrismicProjectSchemaOrgBreadcrumbEntry {
    name: string
    item: string
}

interface PrismicProjectSchemaOrgMeta {
    title: string
    description?: string
    canonicalUrl: string
    /** Ancestor listing(s) (e.g. home/archive) the project is reached from — this project's own
     * entry is appended automatically, callers only pass what comes before it. */
    breadcrumb?: PrismicProjectSchemaOrgBreadcrumbEntry[]
}

/** schema.org `CreativeWork` node for a project document. There's no Prismic field to select a
 * more specific subtype (`VisualArtwork`, `Photograph`, etc.) — `@type` always falls back to the
 * generic `CreativeWork`, which is a safe default across any kind of creative portfolio. */
export function usePrismicProjectSchemaOrg(documentOrRef: MaybeRefOrGetter<ProjectPageDocument | null | undefined>, meta: PrismicProjectSchemaOrgMeta) {
    const doc = toRef(documentOrRef)
    if (!doc.value) return

    const { data } = doc.value
    const embed = data.embed as EmbedField<VideoOEmbed & OEmbedExtra>
    const hasVideo = isFilled.embed(embed) && embed.type === 'video'
    // `CreativeWork` has no dedicated nuxt-schema-org resolver (see the module-level comment
    // below), so none of its relation properties go through the identity-linking pass that
    // Article/WebPage get automatically — a short `{ '@id': '#identity' }` reference wouldn't be
    // expanded/matched against the graph's actual (fully-qualified) node id. Building that exact
    // id ourselves is what makes this resolve to the same Person defined in
    // app/plugins/prismic-schema-org.ts, standard JSON-LD `@id` matching (by exact string) does
    // the rest, independently of nuxt-schema-org's own resolution pipeline.
    const identityId = `${withTrailingSlash(useRuntimeConfig().public.site.url)}#identity`

    useSchemaOrg([
        {
            '@type': 'CreativeWork',
            'name': meta.title,
            'description': meta.description,
            'image': isFilled.image(data.main_media) ? data.main_media.url : undefined,
            'dateCreated': isFilled.date(data.creation_date) ? data.creation_date : undefined,
            'url': meta.canonicalUrl,
            'creator': { '@id': identityId },
            'keywords': doc.value.tags.length ? doc.value.tags.join(', ') : undefined,
            // No dedicated "video upload date" field in Prismic — `creation_date` is the closest
            // available approximation, same one used for the CreativeWork's own `dateCreated`.
            'video': hasVideo
                ? defineVideo({
                    name: embed.title || meta.title,
                    description: meta.description,
                    thumbnailUrl: embed.thumbnail_url || undefined,
                    uploadDate: isFilled.date(data.creation_date) ? data.creation_date : undefined,
                    embedUrl: embed.embed_url,
                })
                : undefined,
        },
        defineBreadcrumb({
            itemListElement: [
                ...(meta.breadcrumb || []),
                // The bare project title, not `meta.title` (which carries the " | site name" suffix
                // used for the <title> tag — redundant/noisy as a breadcrumb label).
                { name: data.title || meta.title, item: meta.canonicalUrl },
            ],
        }),
    ])
}
