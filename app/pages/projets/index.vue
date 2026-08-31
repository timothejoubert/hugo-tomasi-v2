<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.PROJECT_LISTING)
usePrismicMeta(document, { schemaOrgType: 'CollectionPage' })
</script>

<template>
    <VPageWrapper
        :slices="document?.data.slices"
        class="grid-container"
    >
        <h1
            class="text-h1"
            :class="$style.title"
        >
            {{ document?.data.title }}
        </h1>
        <VMainProjectListing />
    </VPageWrapper>
</template>

<style lang="scss" module>
.title {
    margin-bottom: 18px;
}
</style>
