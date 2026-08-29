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
            layout="featured"
            :class="$style.card"
        />
    </section>
</template>

<style lang="scss" module>
// Figma shows this slice on a light/inverted section (dark theme elsewhere on the page) —
// flip the two theme tokens locally rather than adding a whole second global theme entry.
.root {
  background-color: var(--color-background);
  color: var(--color-content);
}

.card {
  width: 100%;
}
</style>
