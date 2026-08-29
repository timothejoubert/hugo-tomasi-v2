<script lang="ts" setup>
import { SKIP_LINKS } from '~/constants/skip-links'
import { components } from '~/slices'

defineProps<{
	slices?: SliceZone[]
}>()
</script>

<template>
    <main
        :id="SKIP_LINKS.main.elementId"
    >
        <slot />
        <SliceZone
            v-if="slices"
            :slices="slices"
            :components="components"
        />
        <slot name="after" />
    </main>
</template>
