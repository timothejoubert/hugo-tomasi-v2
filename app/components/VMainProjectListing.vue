<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const options = computed(() => ({
	orderings: [
		{
			field: 'my.project.order_date',
			direction: 'desc' as const,
		},
		{
			field: 'my.project.creation_date',
			direction: 'desc' as const,
		},
	]
}))

const { data: projects } = await usePrismicFetchDocumentListing(prismicDocumentType.PROJECT, options)

const { phase } = usePageIntro()
const pageRevealed = computed(() => phase.value === 'page' || phase.value === 'done')
</script>

<template>
    <ul
        v-if="projects?.length"
        :class="$style.root"
    >
        <LazyVProjectCard
            v-for="(project, index) in projects"
            :key="project.uid"
            wrapper="li"
            :project="project"
            :class="[$style.item, pageRevealed && $style['item--visible']]"
            :style="{ '--item-index': index }"
        />
    </ul>
</template>

<style lang="scss" module>
.root {
    --grid-container-width: 100%;

    display: grid;
    height: min-content;
    gap: var(--gutter);
    grid-template-columns: minmax(0, 1fr);
    margin-block: initial;
    padding-inline: initial;

    @include grid-container;

    @include media('>=md') {
        grid-template-columns: repeat(var(--v-home-grid-columns, 4), minmax(0, 1fr));
    }
}

.item {
    grid-column: 1 / -1;
    list-style: none;
    opacity: 0;
    translate: 0 24px;

    @include media('>=md') {
        grid-column: auto;
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
