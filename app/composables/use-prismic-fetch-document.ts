import { NotFoundError } from '@prismicio/client'
import type { AsyncData, AsyncDataOptions, NuxtError } from '#app'
import type { ExtractPrismicDocument, PrismicDocumentType } from '~/types/api'
import { isDynamicDocument } from '~~/shared/prismic-schema'

export function usePrismicFetchDocument<Type extends PrismicDocumentType = PrismicDocumentType>(
	prismicDocument: Type | undefined,
	options?: { uid?: string, id?: string } & AsyncDataOptions<ExtractPrismicDocument<Type> | undefined>,
): AsyncData<ExtractPrismicDocument<Type> | undefined, NuxtError<unknown> | undefined> {
	const { uid: uidOverride, id: idOverride, ...asyncDataOptions } = options ?? {}

	const route = useRoute()
	const routeUid = uidOverride || route.params?.uid || ''
	const uid = Array.isArray(routeUid) ? routeUid.at(-1) : routeUid // get the last uid when route has subPage

	const { documentId: previewId } = usePrismicPreviewRoute()
	const documentId = computed(() => idOverride || previewId.value)

	const dataKey = `page-${prismicDocument}-${uid || documentId.value || 'single-document'}`

	const prismicClient = usePrismic().client
	const { fetchLocaleOption } = useLocale()

	const prismicFetchOptions = {
		...fetchLocaleOption.value,
		brokenRoute: '/404',
	}

	// `useAsyncData`'s own PickFrom/KeysOf machinery can't statically collapse to `ExtractPrismicDocument<Type>` while `Type` is still abstract here — true for any concrete `Type`, unprovable to TS inside the generic body
	return useAsyncData<ExtractPrismicDocument<Type> | undefined>(dataKey, async (): Promise<ExtractPrismicDocument<Type> | undefined> => {
		try {
			if (documentId.value) {
				// preview mode can resolve to any document type, not just `Type` — the caller requested `Type`, so trust that contract here
				return await prismicClient.getByID(documentId.value, prismicFetchOptions) as ExtractPrismicDocument<Type>
			}
			if (uid && prismicDocument && isDynamicDocument(prismicDocument)) {
				// @ts-expect-error — @prismicio/client's own ExtractDocumentType<AllDocumentTypes, Type> is structurally identical to our ExtractPrismicDocument<Type>, but TS won't unify the two deferred generic aliases while `Type` is still abstract
				return await prismicClient.getByUID(prismicDocument, uid, prismicFetchOptions)
			}
			if (prismicDocument) {
				// @ts-expect-error — same deferred-generic-alias limitation as getByUID above
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
	}) as AsyncData<ExtractPrismicDocument<Type> | undefined, NuxtError<unknown> | undefined>
}
