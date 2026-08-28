<script lang="ts" setup>
import { isFilled } from '@prismicio/client'
import type { HomePageDocumentData } from '~~/prismicio-types'

interface VHeaderHomeProps {
	pageData: HomePageDocumentData
}

const props = defineProps<VHeaderHomeProps>()
const isCtaHovered = ref(false)

const mediaField = computed(() => isFilled.embed(props.pageData?.embed_video) ? props.pageData.embed_video : props.pageData?.media)

const hasVideo = computed(() => !!mediaField.value && (
	isFilled.embed(props.pageData?.embed_video) || isFilled.linkToMedia(props.pageData?.media)
))

// TODO: Add media viewer
</script>

<template>
    <header
        v-if="pageData"
        :class="$style.root"
        class="container--fullwidth"
    >
        <h1
            v-if="pageData.title"
            class="text-h1"
        >
            {{ pageData.title }}
        </h1>
        <VText
            v-if="pageData.subtitle"
            :content="pageData.subtitle"
            :class="$style.tagline"
            class="text-h5"
            tag="p"
        />
        <div :class="$style['media-wrapper']">
            <VPrismicMedia
                v-if="hasVideo"
                :field="mediaField"
                :class="$style.video"
                playsinline
                background
                fit="cover"
            />
        </div>
        <VHeaderBottom
            :title="pageData.sub_section_title"
            :content="pageData.sub_section_content"
            :alt-content="pageData.sub_section_aside"
            :class="$style.body"
        >
            <div :class="$style['video-cta']">
                <div
                    :class="$style['video-cta__label']"
                    @mouseenter="isCtaHovered = true"
                    @mouseleave="isCtaHovered = false"
                >
                    <VSplitText
                        class="text-body-xs"
                        render="chars"
                        :play-animation="isCtaHovered"
                        :content="$t('showreel.cta_label')"
                    />
                </div>
                <VButton
                    v-if="hasVideo"
                    design="filled"
                    icon-name="material-symbols:fullscreen"
                    :class="$style['button-fullscreen']"
                    @mouseenter="isCtaHovered = true"
                    @mouseleave="isCtaHovered = false"
                />
            </div>
        </VHeaderBottom>
    </header>
</template>

<style lang="scss" module>
.root {
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  padding-top: var(--v-top-bar-height);
  margin-top: calc(var(--v-top-bar-height) * -1);
  background-color: var(--color-background);
  color: var(--color-content);
  isolation: isolate;
  padding-inline: var(--page-gutter);
}

.tagline {
  max-width: 70%;
  margin-top: 18px;

  @include media('>=md') {
    max-width: 25ch;
  }
}

.media-wrapper {
  position: absolute;
  z-index: -1;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  inset: 0;
  pointer-events: none;

  &::after {
    position: absolute;
    background-color: color-mix(in srgb, var(--color-background) 90%, transparent);
    content: '';
    inset: 0;
    pointer-events: none;
  }
}

.video {
  position: absolute;
  width: 100%;

  // inset: 0;
  // object-fit: cover;
  // height: 100%;

  // :global(video) {
  //  width: 100vw !important;
  //  height: 100vh !important;
  //  object-fit: cover;
  // }
}

.body {
  margin-top: auto;

  @include media('<md') {
    padding-top: 200px;
  }
}

.video-cta {
  display: none;

  @include media('>=md') {
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 10px;
    translate: 0 -50%;
  }
}

.video-cta__label {
	--split-word-duration: 300ms;

	position: absolute;
	display: inline-flex;
	align-items: center;

	// opacity: 0;
	transition: opacity 0.3s;
	translate: calc((100% + 10px) * -1) 0;

  .video-cta:hover & {
    opacity: 1;
  }
}

.button-fullscreen {
  --v-button-padding-inline: 0;
}
</style>
