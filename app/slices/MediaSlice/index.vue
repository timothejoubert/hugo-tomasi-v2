<script setup lang="ts">
import { isFilled, type Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.MediaSliceSlice>())


function resolveMediaField(item: (typeof medias)[number]) {
    if (isFilled.embed(item.embed_video)) return item.embed_video
    if (isFilled.linkToMedia(item.media)) return item.media
    return undefined
}

function isBackgroundVideo(item: (typeof medias)[number]) {
    return isFilled.linkToMedia(item.media) && item.media.kind !== 'image'
}

function getMediaSizes() {
    return 'xs:100vw sm:100md md:100vw lg:75vw xl:75vw xxl:75vw hd:75vw qhd:75vw'
}

const title = props.slice.primary?.title
const content = props.slice.primary?.content
const layout = props.slice.primary?.layout
const medias = props.slice.items

</script>

<template>
    <VSlice
        v-if="medias?.length"
        :slice="slice"
        :class="[
            $style.root,
            layout && $style[`root--${layout}`],
            medias.length > 1 && $style['root--multiple'],
        ]"
        spacing="xs"
    >
        <VSliceTitle
            v-if="title"
            :title="title"
            :class="$style.title"
        />
        <VText
            v-if="content"
            :content="content"
            :class="$style.content"
            class="text-body"
        />
        <div
            v-for="(item, mediaIndex) in medias"
            :key="mediaIndex"
            :class="$style['media-wrapper']"
        >
            <VPrismicMedia
                :class="$style.media"
                :field="resolveMediaField(item)"
                :sizes="getMediaSizes()"
                :background="isBackgroundVideo(item)"
            />
            <VButton
                tag="span"
                design="filled"
                icon-name="material-symbols:fullscreen"
                :class="$style.cta"
            />
        </div>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: grid;
    align-items: flex-start;
    grid-template-columns: 1fr;

    &--multiple {
        gap: var(--gutter);
        grid-template-columns: 1fr 1fr;
    }
}

.title {
    --v-slice-title-margin-bottom: 18px;

    grid-column: 1 / -1;
}

.content {
    grid-column: 1 / -1;
    margin-block: 0 18px;
}

.media-wrapper {
    position: relative;

    .root--fullwidth & {
        width: calc(100% + var(--grid-margin) * 2);
        margin-left: calc(var(--grid-margin) * -1);
    }

    .root--centered & {
        width: flex-grid(7, 12);
        margin-inline: auto;
    }

    .root--multiple.root--fullwidth &,
    .root--multiple.root--centered & {
        grid-column: 1 / -1;
    }
}

.media {
    width: 100%;
}

.cta {
    position: absolute;
    right: 20px;
    bottom: 20px;
}
</style>
