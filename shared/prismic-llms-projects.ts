import type { ProjectDocument } from '../prismicio-types'
import { asText, createClient, filter } from '@prismicio/client'
import { getRoutePath, type PrismicRouteName, prismicDocumentType } from './prismic-schema'

function toLlmsEntry(routeName: PrismicRouteName, doc: ProjectDocument) {
	return {
		title: doc.data.title || doc.uid,
		path: getRoutePath(routeName, { uid: doc.uid }),
		description: asText(doc.data.short_description) || undefined,
	}
}

/** Full project list for `llms.txt` — same home/archive split as the sitemap (by `favorite`). */
export async function getPrismicLlmsProjects(repositoryName: string) {
	const client = createClient(repositoryName)

	const [projects] = await Promise.all([
		client.getAllByType(prismicDocumentType.PROJECT_PAGE),
	])

	return [
		...projects.map(doc => toLlmsEntry('projet', doc)),
	]
}
