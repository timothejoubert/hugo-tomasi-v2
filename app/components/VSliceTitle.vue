<script lang="ts" setup>
import type { VWrapperElement } from '~/components/VWrapper.vue'

defineProps<{
    title: string
    wrapper?: VWrapperElement
}>()
</script>
<template>
    <VWrapper
        :wrapper="wrapper || 'h2'"
        :class="$style.title"
        class="text-overtitle"
    >
        {{ title }}
    </VWrapper>
</template>
<style lang="scss" module>
.title {
    margin-bottom: var(--v-slice-title-margin-bottom, 42px);
    opacity: 0.6;
}
</style>
