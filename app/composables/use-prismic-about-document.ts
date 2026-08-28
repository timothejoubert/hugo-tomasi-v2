export async function usePrismicAboutDocument() {
	const prismicClient = usePrismic().client

	return useAsyncData('about-document', () => prismicClient.getSingle('about'), {
		getCachedData: (key, nuxtApp) => nuxtApp.static.data[key] ?? nuxtApp.payload.data[key],
		dedupe: 'defer',
		deep: false,
	})
}
