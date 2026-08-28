<script setup lang="ts">
import type { Content } from '@prismicio/client'
import { getPrismicOrderingField, prismicDocumentType } from '~~/shared/prismic-schema'

const props = defineProps(getSliceComponentProps<Content.ProjectsFeedSliceSlice>())
const title = computed(() => props.slice.primary?.title)

const { data: listingResponse } = await usePrismicFetchDocumentListing(prismicDocumentType.PROJECT, {
	limit: 10,
	orderings: [{ field: getPrismicOrderingField(prismicDocumentType.PROJECT, 'creation_date'), direction: 'desc' }],
})
</script>

<template>
    <VProjectsCarousel
        v-if="listingResponse"
        :title="title || undefined"
        tag="section"
        :projects="listingResponse"
    />
</template>
