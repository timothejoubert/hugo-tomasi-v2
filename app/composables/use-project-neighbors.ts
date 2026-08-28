import type { ProjectPageDocument } from '~~/prismicio-types'
import { getRoutePath } from '~~/shared/prismic-schema'

interface ProjectNeighbor {
	title: ProjectPageDocument['data']['title']
	path: string
}

/** Previous/next project within the same listing (home "favorite" or archive), wrapping around at both ends. */
export function useProjectNeighbors(document: ProjectPageDocument) {
	const { data: projects } = usePrismicFetchDocumentListing('project_page')

	function toNeighbor(project?: ProjectPageDocument): ProjectNeighbor | undefined {
		if (!project) return undefined

		return {
			title: project.data.title,
			path: getRoutePath('project_page', { uid: project.uid })
		}
	}

	const currentIndex = computed(() => projects.value?.findIndex(project => project.uid === document.uid) ?? -1)

	const prevProject = computed(() => {
		const list = projects.value
		if (!list || list.length < 2 || currentIndex.value === -1) return undefined
		return toNeighbor(list[(currentIndex.value - 1 + list.length) % list.length])
	})

	const nextProject = computed(() => {
		const list = projects.value
		if (!list || list.length < 2 || currentIndex.value === -1) return undefined
		return toNeighbor(list[(currentIndex.value + 1) % list.length])
	})

	return { prevProject, nextProject }
}
