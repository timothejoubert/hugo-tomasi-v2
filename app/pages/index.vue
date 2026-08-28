<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.HOME)
</script>

<template>
    <VPageWrapper
		:slices="document?.data.slices"
	>
        <h1>{{ document?.data.title }}</h1>
    </VPageWrapper>
</template>
