<script lang="ts" setup>
type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
const DIRECTIONS: ResizeDirection[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

const props = withDefaults(defineProps<{
    storageKey?: string
    minWidth?: number
    minHeight?: number
    containerSelector?: string
    ariaLabel?: string
}>(), {
    storageKey: 'v-window',
    minWidth: 330,
    minHeight: 400,
})

const emit = defineEmits<{ close: [] }>()

const rootEl = useTemplateRef<HTMLElement>('rootEl')
const headEl = useTemplateRef<HTMLElement>('headEl')
const containerEl = ref<HTMLElement | null>(null)

// Below `md`, a saved desktop drag/resize position can place the whole window off-screen —
// the responsive layout (full width, anchored to the top) takes over instead, so saved
// position/size are ignored and the interactions themselves are disabled.
const { width: viewportWidth } = useWindowSize()
const isMobile = computed(() => viewportWidth.value < breakpoint('md'))

// Modal-like behaviour: this window visually covers the page behind it, so it needs
// dialog semantics — focus moves in on mount, is trapped while open, and returns to
// whatever triggered it (e.g. the project card link) once the consumer closes it.
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

onMounted(() => {
    if (!props.containerSelector) return null
    containerEl.value = document.querySelector(props.containerSelector) as HTMLElement | null
})

// Drag
const savedPosition = useCookie<{ x: number, y: number } | null>(
    `${props.storageKey}-position`,
    { default: () => null },
)
const hasDragged = ref(!!savedPosition.value)

const { x, y, isDragging } = useDraggable(rootEl, {
    handle: headEl,
    containerElement: containerEl,
    ...(savedPosition.value && { initialValue: savedPosition.value }),
})

watch(isDragging, (dragging) => {
    if (dragging) hasDragged.value = true
})

watch([x, y], ([newX, newY]) => {
    if (hasDragged.value && !isMobile.value) savedPosition.value = { x: newX, y: newY }
})

// Resize
const { startResize, isResizing, style: resizeStyle } = useResizable(rootEl, {
    containerEl,
    minWidth: props.minWidth,
    minHeight: props.minHeight,
    storageKey: `${props.storageKey}-size`,
    position: { x, y, onActivate: () => { hasDragged.value = true } },
    disabled: isMobile,
})

// Combined style
const windowStyle = computed(() => ({
    ...(hasDragged.value && !isMobile.value && { left: `${x.value}px`, top: `${y.value}px` }),
    ...resizeStyle.value,
}))
</script>

<template>
    <div
        ref="rootEl"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        tabindex="-1"
        :class="[$style.root, isResizing && $style['root--resizing']]"
        :style="windowStyle"
        @keydown="onKeydown"
    >
        <div
            v-for="dir in DIRECTIONS"
            :key="dir"
            :class="$style[`resize-handle--${dir}`]"
            @pointerdown.stop="startResize($event, dir)"
        />

        <div :class="$style.inner">
            <div
                ref="headEl"
                :class="$style.head"
            >
                <slot name="head" />
            </div>
            <slot />
        </div>
    </div>
</template>

<style lang="scss" module>
$handle-edge: 4px;
$handle-corner: 10px;

.root {
    position: var(--v-window-display, fixed);
    border: 1PX solid var(--color-surface);
    border-radius: 12px;
    background-color: var(--color-background);
    box-shadow: -5px 5px 20PX 10PX rgb(0, 0, 0, 20%);

    &--resizing {
        pointer-events: none;
    }
}

.inner {
    width: 100%;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
}

.head {
    position: sticky;
    z-index: 1;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: inherit;
    background-color: var(--color-surface);
    color: var(--color-content);
    cursor: move;

    @include media('<md') {
        cursor: default;
    }

    &::before {
        position: absolute;
        top: -3px;
        right: -5px;
        left: -5px;
        display: block;
        height: 15px;
        background-color: var(--color-surface);
        content: '';
        pointer-events: none;
    }
}

// Resize handles
[class*='resize-handle--'] {
    position: absolute;
    z-index: 10;

    .root--resizing & {
        pointer-events: auto;
    }

    @include media('<md') {
        display: none;
    }
}

.resize-handle--n  { top: 0; right: $handle-corner; left: $handle-corner; height: $handle-edge; cursor: n-resize; }
.resize-handle--s  { right: $handle-corner; bottom: 0; left: $handle-corner; height: $handle-edge; cursor: s-resize; }
.resize-handle--e  { top: $handle-corner; right: 0; bottom: $handle-corner; width: $handle-edge; cursor: e-resize; }
.resize-handle--w  { top: $handle-corner; bottom: $handle-corner; left: 0; width: $handle-edge; cursor: w-resize; }
.resize-handle--ne { top: 0; right: 0; width: $handle-corner; height: $handle-corner; cursor: ne-resize; }
.resize-handle--nw { top: 0; left: 0; width: $handle-corner; height: $handle-corner; cursor: nw-resize; }
.resize-handle--se { right: 0; bottom: 0; width: $handle-corner; height: $handle-corner; cursor: se-resize; }
.resize-handle--sw { bottom: 0; left: 0; width: $handle-corner; height: $handle-corner; cursor: sw-resize; }
</style>
