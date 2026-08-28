import { joinURL } from 'ufo'

export function getFormattedLocale(localeCode: string | undefined) {
	if (localeCode?.split('-').length) return localeCode.split('-')[0]
	return localeCode
}

export function useLocale() {
	const route = useRoute()
	const { $i18n } = useNuxtApp()

	const availableLocaleCodes = computed(() => $i18n.locales.value.map(locale => getFormattedLocale(locale.code) || locale.code))

	// Match the first path segment only — a substring check against the whole path (e.g. `.includes('fr')`)
	// false-positives on any uid that happens to contain a locale code, such as "exo-front" or "diesel-fragrance".
	const extractLocaleFromUrl = computed(() => {
		const firstSegment = route.path.split('/').filter(Boolean)[0]
		return availableLocaleCodes.value.find(localeCode => localeCode === firstSegment)
	})

	const fetchLocaleOption = computed(() => {
		if (!extractLocaleFromUrl.value) {
			return undefined // { lang: $i18n.defaultLocale }
		}
		else return { lang: extractLocaleFromUrl.value }
	})

	function getLocalizedUrl(url: string) {
		const currentLocale = $i18n.locale.value.toLowerCase()

		if (currentLocale === $i18n.defaultLocale.toLowerCase()) {
			return url
		}
		else {
			return joinURL(currentLocale, url)
		}
	}

	return { fetchLocaleOption, getLocalizedUrl }
}
