import type { VPrismicMediaField } from '~/components/VPrismicMedia.vue'

export interface MediaViewerItem {
    field: VPrismicMediaField
}

/**
 * Single global lightbox state, shared across every trigger (VHeaderHome's showreel CTA,
 * each MediaSlice item's fullscreen CTA, ...) — one `VMediaViewer` is mounted once at the
 * app root and reacts to this state, instead of one dialog instance per trigger.
 *
 * Navigation between items is delegated to VMediaViewer's VCarousel once open (scroll-based,
 * not index state here) — this only tracks which item to open on, not which one is current.
 */
export const useMediaViewer = createSharedComposable(() => {
    const isOpen = ref(false)
    const items = ref<MediaViewerItem[]>([])
    const startIndex = ref(0)

    function open(newItems: MediaViewerItem[], index = 0) {
        if (!newItems.length) return
        items.value = newItems
        startIndex.value = index
        isOpen.value = true
    }

    function close() {
        isOpen.value = false
    }

    return { isOpen, items, startIndex, open, close }
})
