import type { PrismicRepeatableDocumentType } from '~/types/api'
import { generateHashFromObject } from '~/utils/hash'

type PrismicClient = ReturnType<typeof usePrismic>['client']
export type GetAllByTypeParams = Parameters<PrismicClient['getAllByType']>[1]

export function usePrismicFetchDocumentListing(
	prismicDocument: PrismicRepeatableDocumentType,
	options: MaybeRefOrGetter<GetAllByTypeParams> = {},
) {
	const prismicClient = usePrismic().client
	const fetchOptions = computed(() => {
		return {
			...useLocale()?.fetchLocaleOption.value,
			...toValue(options),
		}
	})

	const hash: string[] = [prismicDocument]
	if (Object.keys(fetchOptions.value).length) {
		hash.push(generateHashFromObject(fetchOptions.value))
	}

	const key = `documents-${hash.join('-')}`

	return useAsyncData(
		key,
		() => prismicClient.getAllByType(prismicDocument, fetchOptions.value),
		{
			getCachedData: (key, nuxtApp, ctx) => {
				if (ctx.cause !== 'initial') return undefined
				return nuxtApp.static.data?.[key] ?? nuxtApp.payload.data?.[key]
			},
			watch: [fetchOptions],
		},
	)
}
