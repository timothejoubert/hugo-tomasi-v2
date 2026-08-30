import { toRef } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { isFilled } from '@prismicio/client'
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

    useSchemaOrg([
        {
            '@type': 'CreativeWork',
            'name': meta.title,
            'description': meta.description,
            'image': isFilled.image(data.main_media) ? data.main_media.url : undefined,
            'dateCreated': isFilled.date(data.creation_date) ? data.creation_date : undefined,
            'url': meta.canonicalUrl,
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
