import type { ReachableDocument } from '~/types/api'

export interface Page {
	title?: string
	document?: ReachableDocument | null | undefined
}

export function usePage(page?: Page) {
	const nextPage = useNextPage()
	const currentPage = useCurrentPage()

	nextPage.value = {
		title: page?.title,
		document: page?.document,
	}

	function updatePage() {
		currentPage.value = {
			...nextPage.value,
		}
	}

	const route = useRoute()
	const nuxtApp = useNuxtApp()
	if (route.meta.pageTransition) {
		nuxtApp.hooks.hook('page:loading:start', updatePage)
	}
	else {
		updatePage()
	}
}
