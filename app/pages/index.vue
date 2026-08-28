<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.HOME)
usePrismicMeta(document)
</script>

<template>
    <VPageWrapper
        :slices="document?.data.slices"
    >
		<VHeaderHome
			v-if="document?.data"
			:page-data="document.data"
		/>
    </VPageWrapper>
</template>
