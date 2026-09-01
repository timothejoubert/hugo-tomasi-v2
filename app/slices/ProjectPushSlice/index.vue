<script setup lang="ts">
import type { Content } from '@prismicio/client'
import { prismicDocumentType } from '~~/shared/prismic-schema'

const props = defineProps(getSliceComponentProps<Content.ProjectPushSliceSlice>())

const projectReference = computed(() => props.slice.primary.project_reference)
const projectId = computed(() => projectReference.value?.id)

const { data: project } = await usePrismicFetchDocument(prismicDocumentType.PROJECT, { id: projectId.value })
</script>

<template>
    <VSlice
        v-if="project"
        :slice="slice"
    >
        <VProjectCard
            :project="project"
            title-class="text-h4"
            layout="featured"
        />
    </VSlice>
</template>
