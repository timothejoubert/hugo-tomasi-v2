<script lang="ts" setup>
import { isFilled } from '@prismicio/client'
import type { ProjectPageDocument } from '~~/prismicio-types'
import { getPrismicMediaData } from '~/utils/prismic/media'

const props = defineProps<{
    document: ProjectPageDocument
}>()

const project = computed(() => props.document?.data)
const tags = computed(() => props.document?.tags?.filter(t => t) || [])
const hasHeroMedia = computed(() => isFilled.image(project.value?.main_media))
const hasEmbedVideo = computed(() => getPrismicMediaData(project.value?.embed)?.type === 'embed')

// Mounted as soon as the image is hovered/focused, so the player (and its iframe/video request)
// is already warm by the time the user actually clicks play — kept mounted (not unmounted on
// mouseleave) once triggered, since the point is to save time on the click that follows.
const shouldMountVideo = ref(false)
const isVideoActive = ref(false)

function preloadVideo() {
    shouldMountVideo.value = true
}

function playVideo() {
    shouldMountVideo.value = true
    isVideoActive.value = true
}
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
            class="text-body"
            :class="$style.excerpt"
        />
        <div
            v-if="hasHeroMedia"
            :class="$style.media"
            @mouseenter="hasEmbedVideo && preloadVideo()"
            @focusin="hasEmbedVideo && preloadVideo()"
        >
            <VPrismicImg
                :field="project?.main_media"
                :modifiers="{ fit: 'crop' }"
                :class="[$style.image, isVideoActive && $style['image--hidden']]"
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
            <VPrismicMedia
                v-if="shouldMountVideo"
                :field="project?.embed"
                fit="cover"
                :autoplay="isVideoActive"
                :class="[$style.video, isVideoActive && $style['video--active']]"
            />
            <VButton
                v-if="hasEmbedVideo && !isVideoActive"
                design="filled"
                icon-name="material-symbols:play-arrow"
                :class="$style['play-button']"
                :aria-label="$t('project_header.play_video')"
                @click="playVideo"
            />
        </div>

        <VText
            v-if="project?.content"
            :content="project.content"
            class="text-body"
            :class="$style.content"
        />
    </header>
</template>

<style lang="scss" module>
.header {
    @include theme('dark');

    position: relative;
    background-color: var(--color-background);
    color: var(--color-content);
    grid-auto-flow: dense;
    padding-block: 24px 82px;

    &::before {
        position: absolute;
        z-index: -1;
        background-color: var(--color-background);
        content: '';
        inset: calc(var(--v-main-nav-min-height) * -1) 0 0;
        pointer-events: none;
    }
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
    max-width: 50ch;
    grid-column: 1 /-1;
    margin-block: 0.9lh 0;
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

.media {
    position: relative;
    overflow: hidden;
    width: 100%;
    border-radius: var(--common-border-radius);
    margin-top: 32px;
    grid-column: 1 /-1;
}

.image {
    display: block;
    width: 100%;

    &--hidden {
        visibility: hidden;
    }
}

.video {
    position: absolute;
    z-index: 1;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s;

    &--active {
        opacity: 1;
        pointer-events: auto;
    }
}

.play-button {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.content {
    max-width: 56ch;
    grid-column: 1 /-1;
    margin-block: 24px 0;
}
</style>
