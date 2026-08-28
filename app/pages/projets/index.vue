<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.PROJECT_LISTING)
usePrismicMeta(document, { schemaOrgType: 'CollectionPage' })
</script>

<template>
    <VPageWrapper
		:slices="document?.data.slices"
	>
        <h1>{{ document?.data.title }}</h1>
        <VMainProjectListing />
    </VPageWrapper>
</template>
