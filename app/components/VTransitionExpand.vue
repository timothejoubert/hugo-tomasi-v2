<script setup lang="ts">
// @see https://markus.oberlehner.net/blog/transition-to-height-auto-with-vue/

const props = withDefaults(
    defineProps<{ duration?: number }>(),
    { duration: 300 },
)

function callDoneCallback(element: Element, done: () => void) {
    const animation = element
        .getAnimations()
        .filter(animation => (animation as CSSTransition).transitionProperty === 'height')[0]

    if (animation) animation.finished.then(done)
    else done()
}

function onEnter(element: Element, done: () => void) {
    ;(element as HTMLElement).style.setProperty('--expand-duration', `${props.duration}ms`)
    ;(element as HTMLElement).style.width = getComputedStyle(element).width
    ;(element as HTMLElement).style.position = 'absolute'
    ;(element as HTMLElement).style.visibility = 'hidden'
    ;(element as HTMLElement).style.height = 'auto'

    const height = getComputedStyle(element).height

    ;(element as HTMLElement).style.width = ''
    ;(element as HTMLElement).style.position = ''
    ;(element as HTMLElement).style.visibility = ''
    ;(element as HTMLElement).style.height = '0'

    // Force repaint to make sure the
    // animation is triggered correctly.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    getComputedStyle(element).height

    requestAnimationFrame(() => {
        ;(element as HTMLElement).style.height = height

        callDoneCallback(element, done)
    })
}

function onAfterEnter(element: Element) {
    ;(element as HTMLElement).style.height = 'auto'
    ;(element as HTMLElement).style.removeProperty('--expand-duration')
}

function onLeave(element: Element, done: () => void) {
    ;(element as HTMLElement).style.setProperty('--expand-duration', `${props.duration}ms`)
    ;(element as HTMLElement).style.height = getComputedStyle(element).height

    // Force repaint to make sure the
    // animation is triggered correctly.
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    getComputedStyle(element).height

    requestAnimationFrame(() => {
        ;(element as HTMLElement).style.height = '0'

        callDoneCallback(element, done)
    })
}
</script>

<template>
    <Transition
        name="expand"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @leave="onLeave"
    >
        <!-- eslint-disable-next-line vue/require-toggle-inside-transition -->
        <slot />
    </Transition>
</template>

<style lang="scss">
.expand-enter-active,
.expand-leave-active {
    // overflow: clip rather than overflow: hidden — both clip visually, but hidden creates a new
    // scroll container which breaks position: sticky on descendants during the animation.
    overflow: clip;
    transition: opacity var(--expand-duration, 0.3s), height var(--expand-duration, 0.3s);
}

.expand-enter-active {
    transition-timing-function: ease(in-out-quad);
}

.expand-leave-active {
    transition-timing-function: ease(out-quad);
}

.expand-enter,
.expand-leave-to {
    height: 0;
    opacity: 0;
}
</style>
