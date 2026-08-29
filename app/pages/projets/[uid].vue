<script lang="ts" setup>
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'

const { t } = useI18n()
const { document } = await useFetchPage(prismicDocumentType.PROJECT, { fatal: false })

const { title, description, canonicalUrl } = usePrismicMeta(document, { schemaOrgType: 'ItemPage' })

if (document.value) {
	usePrismicProjectSchemaOrg(document, {
		title: title.value,
		description: description.value,
		canonicalUrl: canonicalUrl.value,
		breadcrumb: [{ name: t('archive_page.heading'), item: getRoutePath(prismicDocumentType.PROJECT_LISTING) }],
	})
}

const { data: otherProjects } = usePrismicFetchDocumentListing(prismicDocumentType.PROJECT)
const filteredOtherProjects = computed(() => otherProjects.value?.filter(p => p.uid !== document.value?.uid))
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
        <LazyVProjectPageContent
            v-if="document"
            :document="document"
        />
        <template #after>
            <VProjectsCarousel
                v-if="filteredOtherProjects?.length"
                tag="section"
                :title="$t('project_page.other_projects_title')"
                :projects="filteredOtherProjects"
            />
            <VProjectNeighbors
                v-if="document"
                :document="document"
            />
        </template>
    </VPageWrapper>
</template>
