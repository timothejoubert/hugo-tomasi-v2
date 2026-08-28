<script setup lang="ts">
defineProps<{
	// Full `prefix:name` icon id (e.g. `material-symbols:cancel`), written literally at each call site
	// so @nuxt/icon's usage scanner (`icon.clientBundle.scan`) can bundle it without a runtime API fetch.
	name: string
	mode?: 'svg' | 'css'
	size?: number | string
}>()
</script>

<template>
    <NuxtIcon
        aria-hidden="true"
        :name="name"
        :size="size"
        :mode="mode"
    />
</template>
