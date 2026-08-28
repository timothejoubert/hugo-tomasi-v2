import { toRef } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { ProjectDocument } from '~~/prismicio-types'
import { getFilledLinkToMedia } from '~/utils/prismic/link-field'

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

/** schema.org `CreativeWork` (or Prismic-driven subtype) node for a project document — `@type` is sourced verbatim from the `creative_work_type` Select field, no mapping needed. */
export function usePrismicProjectSchemaOrg(documentOrRef: MaybeRefOrGetter<ProjectDocument | null | undefined>, meta: PrismicProjectSchemaOrgMeta) {
	const doc = toRef(documentOrRef)
	if (!doc.value) return

	const { data } = doc.value

	useSchemaOrg([
		{
			'@type': data.creative_work_type || 'CreativeWork',
			name: meta.title,
			description: meta.description,
			image: getFilledLinkToMedia(data.thumbnail)?.url,
			dateCreated: data.date || undefined,
			url: meta.canonicalUrl,
			keywords: data.tag_group?.map(({ tag }) => tag).filter(Boolean),
			award: data.awards?.map(({ name }) => name).filter(Boolean),
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
