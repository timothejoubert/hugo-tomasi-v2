<script lang="ts" setup>
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'

const { t } = useI18n()
const { document } = await useFetchPage(prismicDocumentType.PROJECT)

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
        <LazyVProjectHeader
            v-if="document"
            :document="document"
        />
        <template #after>
            <VProjectsCarousel
                v-if="filteredOtherProjects?.length"
                :title="$t('project_page.other_projects_title')"
                :projects="filteredOtherProjects"
                :class="$style['cross-projects']"
            />
        </template>
    </VPageWrapper>
</template>

<style lang="scss" module>
.cross-projects {
    margin-block: 200px;
}
</style>
