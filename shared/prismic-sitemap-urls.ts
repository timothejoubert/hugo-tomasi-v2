import type { ProjectDocument } from '../prismicio-types'
import { createClient, filter, isFilled } from '@prismicio/client'
import { getRoutePath, type PrismicRouteName, prismicDocumentType } from './prismic-schema'

function toSitemapUrl(routeName: PrismicRouteName, doc: ProjectDocument) {
	const thumbnail = doc.data.thumbnail
	const thumbnailUrl = isFilled.linkToMedia(thumbnail) ? thumbnail.url : undefined

	return {
		loc: getRoutePath(routeName, { uid: doc.uid }),
		lastmod: new Date(doc.last_publication_date).toISOString(),
		images: thumbnailUrl ? [{ loc: thumbnailUrl }] : undefined,
	}
}

/**
 * Dynamic sitemap entries for Prismic content. Static page routes (home/archive/about) are
 * auto-discovered by @nuxtjs/sitemap from app/pages — only project uids (dynamic Prismic content,
 * split across the home and archive listings) need resolving here, along with their thumbnail.
 */
export async function getPrismicSitemapUrls(repositoryName: string) {
	const client = createClient(repositoryName)

	const [projects] = await Promise.all([
		client.getAllByType(prismicDocumentType.PROJECT_PAGE),
	])

	return [
		...projects.map(doc => toSitemapUrl('projet', doc)),
	]
}
