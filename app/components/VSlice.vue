<script lang="ts" setup>
import type { SharedSlice } from '@prismicio/client'
import type { VWrapperElement } from '~/components/VWrapper.vue'

defineProps<{
    slice: SharedSlice
    wrapper?: VWrapperElement
    title?: string | null
    spacing?: 'xs' | 'xl' | 'xxl'
    fullwidth?: boolean
}>()
</script>
<template>
    <VWrapper
        :wrapper="wrapper || 'section'"
        :class="[
            'slice-container',
            spacing && `slice-container--${spacing}`,
            fullwidth && 'slice-container--fullwidth'
        ]"
        :id="slice.id"
    >
        <VSliceTitle
            v-if="title"
            :title="title"
        />
        <slot />
    </VWrapper>
</template>
