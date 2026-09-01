<script lang="ts" setup>
import type { KeyTextField, RichTextField } from '@prismicio/client'
import type { VueRichTextSerializer } from '@prismicio/vue'
// import { RichTextNodeType } from '@prismicio/client'

export type VTextContent = string | RichTextField | KeyTextField | null

interface VTextProps {
    tag?: string
    content?: VTextContent
    richTextSerializer?: VueRichTextSerializer | null
    inline?: boolean
}

const prismic = usePrismic()
// Use custom rendered component
// https://prismic.io/docs/fields/rich-text
const props = withDefaults(defineProps<VTextProps>(), {
    richTextSerializer: {
        hyperlink: undefined,
    },
})

const slots = useSlots()
const hasSlot = slots.default?.()

const rawContent = computed(() => {
    return typeof props.content === 'string' ? props.content : undefined
})

const richTextFilled = computed(() => {
    const isRichText = props.content && typeof props.content !== 'string'
    if (isRichText && prismic.isFilled.richText(props.content)) return props.content

    return undefined
})

const flatRichTextContent = computed(() => {
    if (richTextFilled.value?.length === 1 && !richTextFilled.value[0]?.spans.length) {
        return (richTextFilled.value?.[0] as { text: string })?.text
    }

    return undefined
})
</script>

<template>
    <component
        :is="tag || 'p'"
        v-if="rawContent || hasSlot || flatRichTextContent"
        class="markdown"
    >
        <slot>{{ flatRichTextContent ? flatRichTextContent : rawContent }}</slot>
    </component>
    <VWrapper
        v-else-if="!!richTextFilled?.length"
        :wrapper="inline ? false : 'div'"
        class="markdown"
    >
        <PrismicRichText
            :field="richTextFilled"
            :components="richTextSerializer || undefined"
        />
    </VWrapper>
</template>
