<script setup lang="ts">
import { type Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.ProjectsFeedSliceSlice>())
const title = computed(() => props.slice.primary?.title)

const { data: listingResponse } = await usePrismicFetchDocumentListing('project_page', {
  pageSize: 10,
  orderings: [{ field: 'my.project_page.date', direction: 'desc' }],
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
