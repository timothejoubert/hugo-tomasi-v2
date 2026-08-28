export async function usePrismicMenuDocument() {
	const prismicClient = usePrismic().client

	return useAsyncData('menu-document', () => prismicClient.getSingle('menu'))
}
