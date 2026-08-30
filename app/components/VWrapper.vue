<script lang="ts">
import type { ComponentOrTagName } from '~/types/app'

export type VWrapperElement = ComponentOrTagName | false | undefined
</script>

<script lang="ts" setup>
defineProps<{
    wrapper: VWrapperElement
}>()

defineOptions({
    inheritAttrs: false,
})
</script>

<template>
    <component
        :is="wrapper"
        v-if="wrapper"
        v-bind="$attrs"
    >
        <slot />
    </component>
    <template v-else>
        <slot />
    </template>
</template>
