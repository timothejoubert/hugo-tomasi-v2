<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.ProjectPushSliceSlice>())

const projectReference = computed(() => props.slice.primary.project_reference)
const projectId = computed(() => projectReference.value?.id)

const { client } = usePrismic()
const { data: project } = await useAsyncData(projectId.value, () => client.getByID(projectId.value), { deep: false })
</script>

<template>
    <section
        v-if="project"
        class="slice-container"
        :class="$style.root"
    >
        <VProjectCard
            :project="project"
            title-class="text-h4"
            layout="full"
            :class="$style.card"
        />
    </section>
</template>

<style lang="scss" module>
.root {
  --v-card-date-display: none;
}

.card {
  width: 100%;
}

.media {
  width: 100%;
  max-height: 90vh;
  border-radius: 22px;
  object-fit: cover;
}
</style>
