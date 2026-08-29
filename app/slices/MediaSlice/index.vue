<script setup lang="ts">
import { isFilled, type Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.MediaSliceSlice>())

const medias = props.slice.items
const hasOneMedia = medias?.length === 1

// Each item carries two sibling fields (`media` for uploaded image/video, `embed_video` for a
// hosted YouTube/Vimeo embed) — only one is ever filled per item, so resolve to whichever it is
// before handing a single field to VPrismicMedia.
function resolveMediaField(item: (typeof medias)[number]) {
	return isFilled.embed(item.embed_video) ? item.embed_video : item.media
}

// Uploaded videos autoplay/mute/loop with no controls (background-style); embeds keep their
// normal player controls.
function isBackgroundVideo(item: (typeof medias)[number]) {
	return isFilled.linkToMedia(item.media) && item.media.kind !== 'image'
}

const title = props.slice.primary?.title
const content = props.slice.primary?.content
const isFullWidth = props.slice.primary?.full_width
const firstMedia = medias?.[0]
</script>

<template>
    <section
        v-if="medias?.length"
        :class="[$style.root, hasOneMedia ? 'slice-container--xl' : 'slice-container']"
    >
        <template v-if="isFullWidth">
            <div
                v-if="title"
                :content="title"
                :class="$style.title"
                class="text-body-m"
            >
                {{ title }}
            </div>
            <VText
                v-if="content"
                :content="content"
                :class="$style.content"
                class="text-body-s"
            />

            <VPrismicMedia
                v-if="firstMedia"
                :field="resolveMediaField(firstMedia)"
                :class="[$style.image, $style['image--fullwidth']]"
            >
                <VPictureSource
                    media="(max-width: 540px)"
                    sizes="xs:100vw sm:100md md:100vw"
                    width="375"
                    height="300"
                />
                <VPictureSource
                    sizes="lg:100vw xl:100vw xxl:100vw hd:100vw qhd:100vw"
                    width="1278"
                    height="447"
                />
            </VPrismicMedia>
        </template>

        <template v-else>
            <div
                v-for="(item, mediaIndex) in medias"
                :key="mediaIndex"
                :class="[$style['image-wrapper'], $style[`image-wrapper--${hasOneMedia ? 'solo' : 'multiple'}`]]"
            >
                <VPrismicMedia
                    :class="[$style.image, $style['image--default']]"
                    :field="resolveMediaField(item)"
                    :sizes="hasOneMedia
                        ? 'xs:100vw sm:100md md:100vw lg:75vw xl:75vw xxl:75vw hd:75vw qhd:75vw'
                        : 'xs:100vw sm:100md md:100vw lg:50vw xl:50vw xxl:50vw hd:50vw qhd:50vw'"
                    width="812"
                    height="475"
                    :background="isBackgroundVideo(item)"
                />
                <VButton
                    v-if="hasOneMedia"
                    tag="span"
                    design="filled"
                    size="s"
                    icon-name="material-symbols:fullscreen"
                    :class="$style.cta"
                />
            </div>
        </template>
    </section>
</template>

<style lang="scss" module>
.root {
  --v-prismic-media-border-radius: 30px;

  position: relative;
  display: grid;
  gap: calc(var(--grid-margin) * 0.5);
  grid-template-columns: 1fr;
  padding-block: 40px;

  @include media('>=md') {
    grid-template-columns: 1fr 1fr;
  }

  video {
    height: 100%;
    object-fit: cover;
  }
}

.title {
  grid-column: 1 / -1;
}

.content {
  margin-bottom: 14px;
  grid-column: 1 / -1;
}

.image-wrapper {
  position: relative;

  &--solo {
    width: 100%;
    grid-column: 1 / -1;
    justify-self: center;

    @include media('>=md') {
      max-width: 75%;
    }
  }
}

.cta {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.image {
  --v-roadiz-image-width: 100%;

  width: 100%;

  &--default {
    --v-prismic-medias-aspect-ratio: 812 / 475;
  }

  &--fullwidth {
    position: relative;
    left: calc(var(--grid-margin) * -1);
    display: block;
    width: calc(100% + var(--grid-margin) * 2);
    max-width: initial;
    grid-column: 1 / -1;

    img {
      max-width: initial;
    }
  }
}
</style>
