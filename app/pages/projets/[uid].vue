<script lang="ts" setup>
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.PROJECT, { fatal: false })
</script>

<template>
	<VPageWrapper
		:slices="document?.data.slices"
	>
		<NuxtLink
			:to="getRoutePath('home_page')"
			:aria-label="$t('back_to_projects.aria_label')"
		>
			<VIcon name="material-symbols:cancel" />
		</NuxtLink>
        <h1>{{ document?.data.title }}</h1>
        <LazyVProjectPageContent
			v-if="document"
			:document="document"
		/>
    </VPageWrapper>
</template>
