<script lang="ts" setup>
import type { VWrapperElement } from '~/components/VWrapper.vue'

defineProps<{
	label: string | null
	wrapper?: VWrapperElement
}>()
</script>

<template>
    <VWrapper
        :wrapper="wrapper || 'span'"
        :class="$style.root"
    >
        {{ label }}
    </VWrapper>
</template>

<style lang="scss" module>
.root {
	padding: 3px 8px;
	border-radius: 50vmax;
	background-color: var(--color-content);
	color: var(--color-background);
    font-size: 12px;
    font-weight: 400;
}
</style>
