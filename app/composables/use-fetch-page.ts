import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import type { PrismicDocumentPageType } from '~~/shared/prismic-schema'

export async function useFetchPage<T extends PrismicDocumentPageType>(type: T | undefined, options?: { fatal?: boolean }) {
	const route = useRoute()
	const documentType = (type || getDocumentTypeByUrl(route.path)) as T | undefined
	const { isPreview } = usePrismicPreviewRoute()
	const fatal = options?.fatal ?? true

	if (!documentType && !isPreview.value) {
		throw showError({
			message: 'can\'t find prismic document to display during use-fetch-page',
			statusCode: 404,
		})
	}

	const { data, error } = await usePrismicFetchDocument<T>(documentType)

	if (error.value) {
		if (!fatal) {
			setResponseStatus(error.value.statusCode ?? 404)
			return {
				document: data,
				documentType,
			}
		}

		throw showError(error.value)
	}

	usePage({ document: data.value })

	return {
		document: data,
		documentType,
	}
}
