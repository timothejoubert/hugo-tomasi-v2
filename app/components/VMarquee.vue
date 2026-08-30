<script setup lang="ts">
interface VMarqueeProps {
    /** Gap between items, in px. */
    space?: number
    /** Time for one full loop, in ms. */
    speed?: number
    reverse?: boolean
}

const props = withDefaults(defineProps<VMarqueeProps>(), {
    space: 16,
    speed: 20000,
})
</script>

<template>
    <div
        :class="$style.root"
        :style="{
            '--v-marquee-gap': `${props.space}px`,
            '--v-marquee-duration': `${props.speed}ms`,
            '--v-marquee-direction': props.reverse ? 'reverse' : 'normal',
        }"
    >
        <div :class="$style.tape">
            <div :class="$style.group">
                <slot />
            </div>
            <div
                :class="$style.group"
                aria-hidden="true"
            >
                <slot />
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
// A marquee loops seamlessly with pure CSS by duplicating its content once (`.group` x2) and
// translating the whole `.tape` by exactly one `.group`'s width — each `.group` reserves its own
// trailing gap via `padding-right` (rather than a gap between the two `.group`s), so that width
// already accounts for the gap between the end of one loop and the start of the next.
.root {
    display: flex;
    overflow: hidden;
}

.tape {
    display: flex;
    width: max-content;
    animation: v-marquee-scroll var(--v-marquee-duration, 20000ms) linear infinite;
    animation-direction: var(--v-marquee-direction, normal);

    @media (prefers-reduced-motion: reduce) {
        animation-play-state: paused;
    }
}

.group {
    display: flex;
    flex-shrink: 0;
    padding-right: var(--v-marquee-gap, 16px);
    gap: var(--v-marquee-gap, 16px);
}

@keyframes v-marquee-scroll {
    to {
        transform: translateX(-50%);
    }
}
</style>
