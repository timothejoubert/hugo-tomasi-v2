const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Modal dialog a11y behaviour, extracted from VWindow so VMediaViewer can share it: this element
 * visually covers the page behind it, so it needs dialog semantics — focus moves in on mount, is
 * trapped while open, and returns to whatever triggered it once the consumer closes it.
 */
export function useDialogA11y(rootEl: Ref<HTMLElement | null>, emit: (event: 'close') => void) {
    let previouslyFocused: HTMLElement | null = null

    function getFocusable() {
        return rootEl.value ? Array.from(rootEl.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : []
    }

    function onKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            e.stopPropagation()
            emit('close')
            return
        }

        if (e.key !== 'Tab') return

        const focusable = getFocusable()
        if (!focusable.length) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last?.focus()
        }
        else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first?.focus()
        }
    }

    onMounted(() => {
        previouslyFocused = document.activeElement as HTMLElement | null
        rootEl.value?.focus()
    })

    onBeforeUnmount(() => {
        previouslyFocused?.focus?.()
    })

    return { onKeydown }
}
