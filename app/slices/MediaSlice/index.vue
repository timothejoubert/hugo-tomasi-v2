<script setup lang="ts">
import { isFilled, type Content } from '@prismicio/client'
import type { MediaViewerItem } from '~/composables/use-media-viewer'
import { resolveMediaField } from './resolve-media-field'

const props = defineProps(getSliceComponentProps<Content.MediaSliceSlice, { media: MediaViewerItem[] }>())

const { open: openMediaViewer } = useMediaViewer()

function isBackgroundVideo(item: (typeof medias)[number]) {
    return isFilled.linkToMedia(item.media) && item.media.kind !== 'image'
}

function isVideo(item: (typeof medias)[number]) {
    return isFilled.embed(item.embed_video) || isBackgroundVideo(item)
}

const title = props.slice.primary?.title
const content = props.slice.primary?.content
const layout = props.slice.primary?.layout
const spacing = props.slice.primary?.spacing
const medias = props.slice.items


const mediaSizes = computed(() => {
    let result = 'xs:100vw sm:100md md:100vw'

    if (layout === 'centered') {
        result += ' lg:50vw xl:50vw xxl:50vw hd:50vw qhd:50vw'
    } else if (layout === 'fullwidth') {
        result += ' lg:100vw xl:100vw xxl:100vw hd:100vw qhd:100vw'
    } else if(layout === 'default' && medias?.length > 1) {
        result += ' lg:40vw xl:40vw xxl:40vw hd:40vw qhd:40vw'
    } else {
        result += ' lg:90vw xl:90vw xxl:90vw hd:90vw qhd:90vw'
    }

    return result
})

// Fallback for when this slice isn't rendered through VPageWrapper's SliceZone (which supplies
// the page-wide list via `context.media`) — keeps MediaSlice usable/self-sufficient on its own.
const localMediaItems = computed(() => (medias ?? [])
    .map(resolveMediaField)
    .filter((field): field is NonNullable<typeof field> => !!field)
    .map(field => ({ field })))

// A project page can have several MediaSlice instances — navigating prev/next should walk every
// media on the page, not just this slice's own items, so this prefers the page-wide list built
// once in VPageWrapper.vue and passed down as SliceZone context.
const pageMediaItems = computed(() => props.context?.media?.length ? props.context.media : localMediaItems.value)

// Items without a resolvable field aren't openable, so the viewer's item indexes don't line up
// with the raw `medias`/v-for indexes — look the clicked field back up in `pageMediaItems`
// (by reference) rather than trusting any positional index.
function showMediaViewer(field: ReturnType<typeof resolveMediaField>) {
    const index = pageMediaItems.value.findIndex(mediaItem => mediaItem.field === field)
    if (index === -1) return
    openMediaViewer(pageMediaItems.value, index)
}

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
        :spacing="spacing"
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
                :sizes="mediaSizes"
                :background="isBackgroundVideo(item)"
            />
            <VButton
                v-if="resolveMediaField(item) && !isVideo(item)"
                design="filled"
                icon-name="material-symbols:fullscreen"
                :class="$style.cta"
                @click="showMediaViewer(resolveMediaField(item))"
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
