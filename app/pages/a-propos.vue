<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.ABOUT)
usePrismicMeta(document, { schemaOrgType: 'AboutPage' })
</script>

<template>
    <VPageWrapper
        :slices="document?.data.slices"
    >
        <h1>{{ document?.data.title }}</h1>
    </VPageWrapper>
</template>
