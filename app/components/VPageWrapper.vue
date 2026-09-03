<script lang="ts" setup>
import type { Content, SliceZone } from '@prismicio/client'
import { SKIP_LINKS } from '~/constants/skip-links'
import { components } from '~/slices'
import { resolveMediaField } from '~/slices/MediaSlice/resolve-media-field'

const props = defineProps<{
    slices?: SliceZone[]
}>()

// Built once here (the common entry point for every slices-rendering page) so any MediaSlice on
// the page can navigate the lightbox across ALL of the page's media, not just its own items —
// passed down to every slice via SliceZone's `context`, which MediaSlice already reads.
const pageMedia = computed(() => (props.slices ?? [])
    .filter((s): s is Content.MediaSliceSlice => s.slice_type === 'media_slice')
    .flatMap(s => s.items)
    .map(resolveMediaField)
    .filter((field): field is NonNullable<typeof field> => !!field)
    .map(field => ({ field })))
</script>

<template>
    <main
        :id="SKIP_LINKS.main.elementId"
        tabindex="0"
    >
        <slot />
        <SliceZone
            v-if="slices"
            :slices="slices"
            :components="components"
            :context="{ media: pageMedia }"
        />
        <slot name="after" />
    </main>
</template>
