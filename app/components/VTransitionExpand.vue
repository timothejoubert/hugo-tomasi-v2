<script setup lang="ts">
// @see https://markus.oberlehner.net/blog/transition-to-height-auto-with-vue/
import { ease } from '~/utils/ease'

const props = withDefaults(
    defineProps<{ duration?: number }>(),
    { duration: 300 },
)

// A CSS `transition` on `height` needs the browser to have already painted the "from" value
// before the "to" value is applied, or the two collapse into a single frame and nothing visibly
// animates. That's reliably true on leave (the starting height was already on screen for however
// long the panel was open) but NOT on enter of an element that's been `display: none` (via
// v-show) since it was created — its first-ever layout has no prior painted frame to transition
// from, and no number of requestAnimationFrame calls reliably fixes that. The Web Animations API
// sidesteps the problem entirely: element.animate() samples its own keyframes from t=0 the
// instant it's called, so there's no "previous frame" it needs painted first.

function onEnter(element: Element, done: () => void) {
    const el = element as HTMLElement

    el.style.width = getComputedStyle(el).width
    el.style.position = 'absolute'
    el.style.visibility = 'hidden'
    el.style.height = 'auto'

    // getBoundingClientRect (unlike getComputedStyle's `height`) always returns the full visual
    // box including padding/border, regardless of box-sizing.
    const targetHeight = el.getBoundingClientRect().height

    el.style.width = ''
    el.style.position = ''
    el.style.visibility = ''
    el.style.height = '0px'

    const animation = el.animate(
        [{ height: '0px', opacity: 0 }, { height: `${targetHeight}px`, opacity: 1 }],
        { duration: props.duration, easing: ease('in-out-quad'), fill: 'forwards' },
    )

    animation.finished.then(() => {
        // fill: 'forwards' keeps the animation's effect applied (overriding inline styles)
        // until cancelled — set the inline style to match first so cancelling doesn't visibly jump.
        el.style.height = `${targetHeight}px`
        animation.cancel()
        done()
    }).catch(() => done())
}

function onAfterEnter(element: Element) {
    ;(element as HTMLElement).style.height = 'auto'
}

function onLeave(element: Element, done: () => void) {
    const el = element as HTMLElement
    const startHeight = el.getBoundingClientRect().height

    const animation = el.animate(
        [{ height: `${startHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }],
        { duration: props.duration, easing: ease('out-quad'), fill: 'forwards' },
    )

    animation.finished.then(() => {
        el.style.height = '0px'
        animation.cancel()
        done()
    }).catch(() => done())
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

    // Animating `height` forces a layout pass on every frame. `contain` scopes that recalculation
    // to this subtree instead of the whole document (critical when the content is a CSS grid),
    // and `will-change` lets the browser prepare for it ahead of time.
    contain: layout paint;
    will-change: height;
}
</style>
