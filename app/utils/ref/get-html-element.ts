import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'

export type TemplateElement = HTMLElement | ComponentPublicInstance | null
export type TemplateElementRef = MaybeRefOrGetter<TemplateElement>

export function getHtmlElement(element: TemplateElementRef) {
    const el = toValue(element)
    if (!el) return

    return ((el as ComponentPublicInstance)?.$el || el) as HTMLElement | undefined
}
