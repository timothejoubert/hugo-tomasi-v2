<script lang="ts" setup>
import type { VWrapperElement } from '~/components/VWrapper.vue'

withDefaults(defineProps<{
	label: string | null
	wrapper?: VWrapperElement
	/** 'filled' (default): solid pill, used on dark/overlay cards. 'light': plain text, no
	 * pill background — used on light surfaces (e.g. the featured VProjectCard layout). */
	theme?: 'filled' | 'light'
}>(), {
	theme: 'filled',
})
</script>

<template>
    <VWrapper
        :wrapper="wrapper || 'span'"
        :class="[$style.root, $style[`root--${theme}`]]"
    >
        {{ label }}
    </VWrapper>
</template>

<style lang="scss" module>
.root {
    font-size: 12px;
    font-weight: 400;

	&--filled {
		padding: 3px 8px;
		border-radius: 50vmax;
		background-color: var(--color-content);
		color: var(--color-background);
	}

	&--light {
		color: var(--color-content);
	}
}
</style>
