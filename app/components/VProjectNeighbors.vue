<script lang="ts" setup>
import type { ProjectPageDocument } from '~~/prismicio-types'

const props = defineProps<{
    document: ProjectPageDocument
}>()

const { prevProject, nextProject } = useProjectNeighbors(props.document)
</script>

<template>
    <div
        v-if="prevProject || nextProject"
        :class="$style.footer"
    >
        <NuxtLink
            v-if="prevProject"
            :to="prevProject.path"
            :class="$style['footer-link']"
        >
            <VIcon name="material-symbols:arrow-back" />
            {{ prevProject.title }}
        </NuxtLink>
        <NuxtLink
            v-if="nextProject"
            :to="nextProject.path"
            :class="[$style['footer-link'], $style['footer-link--next']]"
        >
            {{ nextProject.title }}
            <VIcon name="material-symbols:arrow-forward" />
        </NuxtLink>
    </div>
</template>

<style lang="scss" module>
.footer {
    display: flex;
    justify-content: space-between;
    padding: var(--v-project-page-padding-inline);
    background-color: var(--color-background);
    gap: 10px;
}

.footer-link {
    display: flex;
    align-items: center;
    color: inherit;
    gap: 6px;
    text-decoration: none;

    &--next {
        margin-left: auto;
        text-align: right;
    }
}
</style>
