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
            v-slot="{ type, content }"
            :field="field"
        >
            <VVariableText
                v-if="type === 'strong'"
                tag="span"
                :class="$style.highlight"
                :content="content"
            />
            <component
                :is="type"
                v-else
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
