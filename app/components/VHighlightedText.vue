<script lang="ts" setup>
import type { RichTextField } from '@prismicio/client'

defineProps<{
	field: RichTextField
	wrapper?: string
}>()
</script>

<template>
    <component
        :is="wrapper || 'div'"
    >
        <VRichText
			:field="field"
			v-slot="{ type, content }"
		>
			<VVariableText
				v-if="type === 'strong'"
				tag="span"
				:class="$style.highlight"
				:content="content"
			/>
			<component
				v-else
				:is="type"
				:class="$style.tag"
			>
				{{ content }}
			</component>
        </VRichText>
    </component>
</template>

<style lang="scss" module>
.highlight {
    position: relative;
    display: inline;
    padding: 0 2px 6px;
    border-radius: 3px;
    background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
    color: var(--color-accent);
}
</style>
