import { createClient } from '@prismicio/client'
import { prismicDocumentType } from './prismic-schema'

/** Full, unfiltered project list — shared by build-time/Nitro consumers (`llms.txt`, sitemap)
 * that each need every `project_page` document, just mapped to a different shape. Not used by
 * client/SSR listings, which go through `usePrismicFetchDocumentListing` instead (locale-aware,
 * paginated, reactive — a different runtime with different needs, not this one). */
export async function getAllPrismicProjects(repositoryName: string) {
    const client = createClient(repositoryName)
    return client.getAllByType(prismicDocumentType.PROJECT)
}
