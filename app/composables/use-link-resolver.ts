import type { ContentRelationshipField } from '@prismicio/client'
import type {
	LocationAsRelativeRaw,
	_RouteRecordBase,
} from 'vue-router'
import type { PrismicReachableDocumentType, ReachableDocument } from '~/types/api'
import { type PrismicDocumentRoute, isPrismicDocumentRoute } from '~~/shared/prismic-schema'
import { ensureProtocol } from '~/utils/url'

export type PossibleRouteReference
	= string
		| undefined
		| null
		| LocationAsRelativeRaw
		| _RouteRecordBase
		| ReachableDocument
		| ContentRelationshipField<PrismicReachableDocumentType>
		| PrismicDocumentRoute

export function useLinkResolver(reference: PossibleRouteReference) {
	const rawSiteUrl = useRuntimeConfig().public?.site.url
	const siteUrl = rawSiteUrl ? ensureProtocol(rawSiteUrl) : rawSiteUrl
	const router = useRouter()

	const url = computed(() => {
		if (!reference) {
			return undefined
		}
		else if (typeof reference === 'object' && isPrismicDocumentRoute(reference)) {
			const { getLocalizedUrl } = useLocale()
			return getLocalizedUrl(reference?.path?.replace('/:lang?', '')) || '/'
		}
		else if (typeof reference === 'string') {
			const hasLang = reference.includes('/:lang?')
			if (!hasLang) return reference

			const { getLocalizedUrl } = useLocale()
			return getLocalizedUrl(reference.replace('/:lang?', ''))
		}
		else if (typeof reference === 'object' && 'url' in reference) {
			return reference.url
		}
		else if (typeof reference === 'object' && 'name' in reference) {
			return router.hasRoute(reference.name as string) ? router.resolve(reference)?.fullPath : undefined
		}
		// else if (typeof reference === 'object') {
		//     return router.resolve(reference as RouteLocationAsRelativeTyped)?.fullPath
		// }
	})

	function startWithSiteUrl(url: string) {
		return siteUrl && !!toValue(url)?.startsWith(siteUrl)
	}

	const isRelative = computed(() => {
		if (!url.value) return false

		return url.value.charAt(0) === '/' || url.value.charAt(0) === '#' || startWithSiteUrl(url.value)
	})

	const isExternal = computed(() => !isRelative.value && !!toValue(url))

	return { isRelative, isExternal, url }
}
