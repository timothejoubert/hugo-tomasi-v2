export function usePrismicPreviewRoute() {
    const route = useRoute()

    const searchParams = computed(() => new URLSearchParams(route.fullPath))
    const documentId = computed(() => searchParams.value.get('documentId'))
    const token = computed(() => searchParams.value.get('token'))
    const websitePreviewId = computed(() => searchParams.value.get('websitePreviewId'))

    const runtimeConfig = useRuntimeConfig()
    const previewPath = runtimeConfig.public?.prismic?.preview

    const isPreview = computed(() => {
        // Preview page redirect to targeted page with queries
        const hasQueries = !!documentId.value && !!token.value && !!websitePreviewId.value

        return route.path.includes(`${previewPath}`) || hasQueries
    })

    return { isPreview, documentId, token, websitePreviewId }
}
