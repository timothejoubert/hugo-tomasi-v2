import type { ProjectPageDocument } from '../prismicio-types'
import { asText } from '@prismicio/client'
import { getAllPrismicProjects } from './prismic-projects'
import { getRoutePath, type PrismicRouteName } from './prismic-schema'

function toLlmsEntry(routeName: PrismicRouteName, doc: ProjectPageDocument) {
    return {
        title: doc.data.title || doc.uid,
        path: getRoutePath(routeName, { uid: doc.uid }),
        description: asText(doc.data.excerpt) || undefined,
    }
}

/** Full project list for `llms.txt` — same home/archive split as the sitemap (by `favorite`). */
export async function getPrismicLlmsProjects(repositoryName: string) {
    const projects = await getAllPrismicProjects(repositoryName)

    return projects.map(doc => toLlmsEntry('project_page', doc))
}
