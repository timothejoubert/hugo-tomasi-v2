<script setup lang="ts">
import { type Content } from '@prismicio/client'
import { isFilledImageField, isFilledLinkToMediaField, isVideoEmbedField } from '~/utils/prismic/guard'

const props = defineProps(getSliceComponentProps<Content.MediaSliceSlice>())

const medias = props.slice.items
const hasOneMedia = medias?.length === 1
const firstMedia = medias?.[0]?.image

const filledMedias = computed(() => {
  return medias.map((media) => {
    let reference

    const nativeVideo = isFilledLinkToMediaField(media.internal_video)
    const image = isFilledImageField(media.image) ? media.image : undefined
    if (isVideoEmbedField(media.embed_video)) {
      reference = media.embed_video
    } else if (media.video_id && media.provider_name) {
      reference = { video_id: media.video_id, provider_name: media.provider_name }
    } else if (nativeVideo) {
      reference = media.internal_video
    } else if (image) {
      reference = image
    }

    return {
      reference,
      video: {
        background: !!nativeVideo,
      },
      image: {
        reference: image,
        width: '812',
        height: '475',
        tag: 'img',
        sizes: hasOneMedia
          ? 'xs:100vw sm:100md md:100vw lg:75vw xl:75vw xxl:75vw hd:75vw qhd:75vw'
          : 'xs:100vw sm:100md md:100vw lg:50vw xl:50vw xxl:50vw hd:50vw qhd:50vw',
      },
    }
  })
})

const title = props.slice.primary?.title
const content = props.slice.primary?.content
const isFullWidth = props.slice.primary?.full_width
</script>

<template>
  <section v-if="medias?.length" :class="[$style.root, hasOneMedia ? 'slice-container-xl' : 'slice-container']">
    <template v-if="isFullWidth">
      <div v-if="title" :content="title" :class="$style.title" class="text-body-m">{{ title }}</div>
      <VText v-if="content" :content="content" :class="$style.content" class="text-body-s" />

      <VPrismicImg :reference="firstMedia" :class="[$style.image, $style['image--fullwidth']]">
        <VPictureSource :media="`(max-width: 540px)`" sizes="xs:100vw sm:100md md:100vw" width="375" height="300" />
        <VPictureSource sizes="lg:100vw xl:100vw xxl:100vw hd:100vw qhd:100vw" width="1278" height="447" />
      </VPrismicImg>
    </template>

    <template v-else-if="filledMedias?.length">
      <VPrismicMedia
        v-for="(item, mediaIndex) in filledMedias"
        :key="mediaIndex"
        :class="[$style.image, $style['image--default'], $style[`image--${hasOneMedia ? 'solo' : 'multiple'}`]]"
        :reference="item.reference"
        :video="item.video"
        :image="item.image"
      />
    </template>
  </section>
</template>

<style lang="scss" module>
.root {
  --v-prismic-media-border-radius: 6px;

  position: relative;
  display: grid;
  gap: calc(var(--page-gutter) * 0.5);
  grid-template-columns: 1fr;

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

.image {
  --v-roadiz-image-width: 100%;

  width: 100%;

  &--solo {
    grid-column: 1 / -1;
    justify-self: center;

    @include media('>=md') {
      max-width: 75%;
    }
  }

  &--default {
    --v-prismic-medias-aspect-ratio: 812 / 475;
  }

  &--fullwidth {
    position: relative;
    left: calc(var(--page-gutter) * -1);
    display: block;
    width: calc(100% + var(--page-gutter) * 2);
    max-width: initial;
    grid-column: 1 / -1;

    img {
      max-width: initial;
    }
  }
}
</style>
