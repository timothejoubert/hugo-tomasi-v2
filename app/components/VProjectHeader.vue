<script lang="ts" setup>
import { isFilled } from '@prismicio/client'
import type { ProjectPageDocument } from '~~/prismicio-types'

const props = defineProps<{
    document: ProjectPageDocument
}>()

const project = computed(() => props.document?.data)
const tags = computed(() => props.document?.tags?.filter(t => t) || [])
const hasHeroMedia = computed(() => isFilled.image(project.value?.main_media))
</script>

<template>
    <header
        :class="$style.header"
        class="grid-extended"
    >
        <h1
            v-if="project?.title"
            class="text-h1"
            :class="$style.title"
        >
            {{ project.title }}
        </h1>
        <div
            v-if="tags.length"
            :class="$style.tags"
        >
            <VTag
                v-for="tag in tags"
                :key="tag"
                :label="tag"
                filled
                theme="light"
            />
        </div>
        <VText
            v-if="project?.excerpt"
            :content="project.excerpt"
            class="text-body-s"
            :class="$style.excerpt"
        />
        <VPrismicImg
            v-if="hasHeroMedia"
            :field="project?.main_media"
            :modifiers="{ fit: 'crop' }"
            :class="$style.image"
        >
            <VPictureSource
                media="(width < 800px)"
                :width="800"
                sizes="xs:92vw sm:92vw md:92vw"
                :height="800"
            />
            <VPictureSource
                media="(width >= 800px)"
                sizes="lg:92vw xl:92vw hq:92vw qhd:92vw"
                :width="1600"
                :height="900"
            />
        </VPrismicImg>

        <VText
            v-if="project?.content"
            :content="project.content"
            class="text-body-s"
            :class="$style.content"
        />
    </header>
</template>

<style lang="scss" module>
.header {
    @include theme('dark');

    background-color: var(--color-background);
    color: var(--color-content);
    grid-auto-flow: dense;
    padding-block: 24px 60px;
}

.title {
    grid-column: 1 /-1;
    margin-block: 0;
    text-transform: uppercase;

    @include media('>=md') {
        grid-column: 1 / span 8;
    }
}

.excerpt {
    max-width: 40ch;
    align-self: flex-end;
    grid-column: 1 /-1;
    margin-block: 0;
    opacity: 0.8;

    @include media('>=md') {
        grid-column: -5 / -1;
        grid-row: 1 / 3;
    }
}

.tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 12px 0 0;
    gap: 10px;
    grid-column: 1 / span 8;
    list-style: none;
}

.image {
    overflow: hidden;
    width: 100%;
    border-radius: var(--common-border-radius);
    margin-top: 32px;
    grid-column: 1 /-1;
}

.content {
    grid-column: 1 /-1;
    margin-block: 16px 0;
}
</style>
