import { prismicDocumentType } from '~~/shared/prismic-schema'

export async function usePrismicSettingsDocument() {
	const prismicClient = usePrismic().client

	return useAsyncData('settings-document', () => prismicClient.getSingle(prismicDocumentType.SETTING), {
		getCachedData: (key, nuxtApp) => nuxtApp.static.data[key] ?? nuxtApp.payload.data[key],
		dedupe: 'defer',
		deep: false,
	})
}
