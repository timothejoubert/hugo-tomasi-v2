<script lang="ts" setup>
import type { SharedSlice } from '@prismicio/client'
import type { VWrapperElement } from '~/components/VWrapper.vue'

defineProps<{
    slice: SharedSlice
    wrapper?: VWrapperElement
    title?: string | null
    spacing?: 'xs' | 'xl' | 'xxl' | 'none'
    fullwidth?: boolean
}>()
</script>
<template>
    <VWrapper
        :wrapper="wrapper || 'section'"
        :class="[
            'slice-container',
            spacing && spacing !== 'none' && `slice-container--${spacing}`,
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
