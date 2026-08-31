<script lang="ts" setup>
import { getPrismicOrderingField, prismicDocumentType } from '~~/shared/prismic-schema'

const { data: projects } = await usePrismicFetchDocumentListing(prismicDocumentType.PROJECT, {
    orderings: [
        {
            field: getPrismicOrderingField(prismicDocumentType.PROJECT, 'creation_date'),
            direction: 'desc',
        },
    ],
})

const { phase } = usePageIntro()
const pageRevealed = computed(() => phase.value === 'page' || phase.value === 'done')

const tags = computed(() => {
    const allTags = projects.value?.flatMap(project => project.tags.filter(t => t) as string[]) ?? []
    return [...new Set(allTags)]
})

const selectedTag = ref<string | null>(null)

const filteredProjects = computed(() => {
    if (!selectedTag.value) return projects.value
    return projects.value?.filter(project => project.tags.includes(selectedTag.value as string))
})
</script>

<template>
    <VProjectListingFilter
        v-if="tags.length"
        v-model="selectedTag"
        :tags="tags"
    />
    <ul
        v-if="filteredProjects?.length"
        :class="$style.list"
        class="inner-grid"
    >
        <LazyVProjectCard
            v-for="(project, index) in filteredProjects"
            :key="project.uid"
            wrapper="li"
            :project="project"
            :class="[$style.item, pageRevealed && $style['item--visible']]"
            :style="{ '--item-index': index }"
        />
    </ul>
</template>

<style lang="scss" module>
.list {
    position: relative;
    height: min-content;
    margin-block: 32px 42px;
    padding-inline: initial;
    row-gap: 14px;
}

.item {
    grid-column: 1 / -1;
    list-style: none;
    opacity: 0;
    translate: 0 24px;

    @include media('>=md') {
        grid-column: span 6;
    }

    @media (prefers-reduced-motion: no-preference) {
        transition: 0.5s ease(out-quad);
        transition-delay: calc(var(--item-index, 0) * 30ms);
        transition-property: opacity, translate;
    }

    &--visible {
        opacity: 1;
        translate: 0 0;
    }
}
</style>
