<script lang="ts" setup>
import { isFilled } from '@prismicio/client'
import type { EmbedField, OEmbedExtra, VideoOEmbed } from '@prismicio/client'
import type { HomePageDocumentData } from '~~/prismicio-types'

interface VHeaderHomeProps {
    pageData: HomePageDocumentData
}

const props = defineProps<VHeaderHomeProps>()
// const isCtaHovered = ref(false)

const mediaField = computed(() => isFilled.embed(props.pageData?.embed_video) ? props.pageData.embed_video : props.pageData?.media)

const hasVideo = computed(() => !!mediaField.value && (
    isFilled.embed(props.pageData?.embed_video) || isFilled.linkToMedia(props.pageData?.media)
))

// The embed's own oEmbed thumbnail — shown immediately as a lightweight poster while the actual
// player mount is deferred below, so the hero isn't visually empty during that wait.
const embedVideo = computed(() => props.pageData?.embed_video as EmbedField<VideoOEmbed & OEmbedExtra>)
const posterUrl = computed(() => isFilled.embed(embedVideo.value) ? embedVideo.value.thumbnail_url ?? undefined : undefined)

// The hero's own text/title already covers the LCP — the video (an iframe embed, in production
// content) brings nothing to it but competes for bandwidth/main-thread during the initial load.
// Mounting it only once the browser is idle (falling back to a short timeout) keeps that cost off
// the critical path without ever really delaying playback in practice.
const shouldMountMedia = ref(false)

function mountMedia() {
    shouldMountMedia.value = true
}

onMounted(() => {
    if (import.meta.client && 'requestIdleCallback' in window) {
        window.requestIdleCallback(mountMedia, { timeout: 2000 })
    }
    else {
        setTimeout(mountMedia, 200)
    }
})

const { open: openMediaViewer } = useMediaViewer()

function showMediaViewer() {
    if (!mediaField.value) return
    openMediaViewer([{ field: mediaField.value }])
}

const loading = ref(false)
</script>

<template>
    <header
        v-if="pageData"
        :class="$style.root"
    >
        <h1
            v-if="pageData.title"
            class="text-h1 visually-hidden"
            :class="$style.title"
        >
            {{ pageData.title }}
        </h1>
        <VText
            v-if="pageData.subtitle"
            :content="pageData.subtitle"
            :class="$style.tagline"
            class="text-h4"
            tag="p"
        />
        <div
            :class="$style.footer"
            class="inner-grid"
        >
            <p
                v-if="pageData.sub_section_title"
                :class="$style['sub-title']"
                class="text-overtitle"
            >
                {{ pageData.sub_section_title }}
                <VLoadingDots v-if="loading" />
            </p>
            <VAnimatedButton
                v-if="hasVideo"
                :label="$t('showreel.cta_label')"
                :class="$style['video-button']"
                icon="material-symbols:fullscreen"
                @click="showMediaViewer"
            />
            <hr :class="$style.line">
            <VText
                v-if="pageData?.sub_section_content"
                :class="$style['content-main']"
                class="text-body-s"
                :content="pageData.sub_section_content"
            />
            <VText
                v-if="pageData?.sub_section_aside"
                :class="$style['content-alt']"
                class="text-body-s"
                :content="pageData.sub_section_aside"
            />
        </div>
        <div :class="$style['media-wrapper']">
            <img
                v-if="posterUrl"
                :src="posterUrl"
                alt=""
                loading="eager"
                fetchpriority="high"
                :class="$style.poster"
            >
            <VPrismicMedia
                v-if="hasVideo && shouldMountMedia"
                :field="mediaField"
                :class="$style.media"
                background
                fit="cover"
                loading="eager"
                fetch-priority="high"
            />
        </div>
    </header>
</template>

<style lang="scss" module>
.root {
    @include theme('dark');

    position: relative;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    padding-top: var(--v-main-nav-min-height);
    padding-bottom: var(--grid-margin);
    margin-top: calc(var(--v-main-nav-min-height) * -1);
    background-color: var(--color-background);
    color: var(--color-content);
    isolation: isolate;
    padding-inline: var(--grid-margin);
}

.title {
    grid-column: 1 / -1;
    margin-block: 0;
}

.tagline {
    grid-column: 1 / -1;

    @include media('>=md') {
        max-width: 25ch;
        margin-block: 22px;
    }
}

.footer {
    margin-top: auto;
}

.sub-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1PX solid rgb(255, 255, 255, 30%);
    grid-column: 1 / -1;
}

.sub-title {
    grid-column: 1 / -3;

    @include media('>=md') {
        grid-column: 1 / span 5;
    }
}

.video-button {
    @include media('<md') {
        --v-animated-text-display: none;
    }

    @include media('>=md') {
        grid-column: 9 / -1;
        justify-self: end;
    }
}

.line {
    width: 100%;
    height: 1PX;
    border: none;
    background-color: rgb(255, 255, 255, 30%);
    grid-column: 1 / -1;
    margin-block: 1rem;
    margin-block: 0;

}

.content-main {
    max-width: 46ch;
    grid-column: 1 / -1;

    @at-root .content-main:not(strong),
    & *:not(strong) {
        opacity: 0.8;
    }

    @include media('>=md') {
        grid-column: 1 / span 5;
    }
}

.content-alt {
    max-width: 46ch;
    grid-column: 1 / -1;

    & p {
        margin-block: 0;
    }

    & *:not(strong) {
        opacity: 0.8;
    }

    @include media('>=md') {
        grid-column: 9 / -1;

        & p {
            margin-block: 16px;
        }
    }
}

.media-wrapper {
    position: absolute;
    z-index: -2;
    inset: 0;
    pointer-events: none;

    > * {
        height: 100%;
    }

    &::after {
        --overlay-transition-color: color-mix(in srgb, var(--color-background) 20%, transparent);

        position: absolute;
        background: linear-gradient(var(--color-background) 12%, var(--overlay-transition-color), var(--color-background) 70%);
        content: '';
        inset: 0;
        pointer-events: none;
    }

    @include media('>=md') {
        &::after {
            background: linear-gradient(var(--color-background) 4%, var(--overlay-transition-color), var(--color-background) 96%);
        }
    }
}

.poster {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
    object-fit: cover;
}
</style>
