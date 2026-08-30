<script lang="ts" setup>
import type { RichTextField } from '@prismicio/client'

const props = defineProps<{
    field: RichTextField
}>()

function parseTextBlocks(richTextBlock: RichTextField<'filled'>[number]) {
    const { text, spans } = richTextBlock
    const result = []
    let cursor = 0

    spans.forEach((span) => {
        // contenu normal avant le span
        if (cursor < span.start) {
            result.push({
                start: cursor,
                end: span.start - 1,
                type: 'span',
                content: ' ' + text.slice(cursor, span.start),
            })
        }

        // contenu du span
        result.push({
            ...span,
            content: text.slice(span.start, span.end),
        })

        cursor = span.end + 1
    })

    // contenu après le dernier span
    if (cursor < text.length) {
        result.push({
            start: cursor,
            end: text.length - 1,
            type: 'span',
            content: text.slice(cursor),
        })
    }

    return result
}

const prismic = usePrismic()

const tags = computed(() => {
    if (prismic.isFilled.richText(props.field)) {
        return props.field.map(parseTextBlocks).flat()
    }

    return undefined
})
</script>

<template>
    <slot
        v-for="(tag, i) in tags"
        :key="i"
        v-bind="tag"
        :index="i"
    />
</template>
