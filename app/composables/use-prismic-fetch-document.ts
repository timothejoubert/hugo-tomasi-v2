import { NotFoundError } from '@prismicio/client'
import type { AsyncDataOptions } from '#app'
import type { ExtractPrismicDocument, PrismicDocumentType } from '~/types/api'
import { isDynamicDocument } from '~~/shared/prismic-schema'

export function usePrismicFetchDocument<Type extends PrismicDocumentType = PrismicDocumentType>(
	prismicDocument: Type | undefined,
	options?: { uid?: string } & AsyncDataOptions<ExtractPrismicDocument<Type> | undefined>,
) {
	const { uid: uidOverride, ...asyncDataOptions } = options ?? {}

	const route = useRoute()
	const routeUid = uidOverride || route.params?.uid || ''
	const uid = Array.isArray(routeUid) ? routeUid.at(-1) : routeUid // get the last uid when route has subPage

	const { documentId, isPreview } = usePrismicPreviewRoute()

	const dataKey = `page-${prismicDocument}-${uid || documentId.value || 'single-document'}`

	const prismicClient = usePrismic().client
	const { fetchLocaleOption } = useLocale()

	const prismicFetchOptions = {
		...fetchLocaleOption.value,
		brokenRoute: '/404',
	}

	return useAsyncData<ExtractPrismicDocument<Type> | undefined>(dataKey, async () => {
		try {
			if (isPreview.value && documentId.value) {
				return await prismicClient.getByID(documentId.value, prismicFetchOptions)
			}
			if (uid && prismicDocument && isDynamicDocument(prismicDocument)) {
				// @ts-expect-error — generic `Type` can't narrow to the literal union getByUID expects
				return await prismicClient.getByUID(prismicDocument, uid, prismicFetchOptions)
			}
			if (prismicDocument) {
				// @ts-expect-error — generic `Type` can't narrow to the literal union getSingle expects
				return await prismicClient.getSingle(prismicDocument, prismicFetchOptions)
			}
			return undefined
		}
		catch (e) {
			if (e instanceof NotFoundError) {
				throw createError({ statusCode: 404, statusMessage: 'Not Found', cause: e })
			}
			throw e
		}
	}, {
		getCachedData: (key, nuxtApp) => nuxtApp.static.data?.[key] ?? nuxtApp.payload.data?.[key],
		dedupe: 'defer',
		deep: false,
		...asyncDataOptions,
	})
}
