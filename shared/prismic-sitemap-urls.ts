import type { ProjectPageDocument } from '../prismicio-types'
import { isFilled } from '@prismicio/client'
import { getAllPrismicProjects } from './prismic-projects'
import { getRoutePath, type PrismicRouteName } from './prismic-schema'

function toSitemapUrl(routeName: PrismicRouteName, doc: ProjectPageDocument) {
    const thumbnail = doc.data.main_media
    const thumbnailUrl = isFilled.image(thumbnail) ? thumbnail.url : undefined

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
    const projects = await getAllPrismicProjects(repositoryName)

    return projects.map(doc => toSitemapUrl('project_page', doc))
}
