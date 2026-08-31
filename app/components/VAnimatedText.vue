<script lang="ts" setup>
import { splitChars } from '~/utils/split-text'

const props = defineProps<{
    content: string | null | undefined
    revealed?: boolean
    swap?: boolean
    duration?: number
    stagger?: number
}>()

const durationMs = computed(() => props.duration ?? 400)
const staggerMs = computed(() => props.stagger ?? 20)

const chars = computed(() => splitChars(props.content))

const appliedRevealed = ref(props.revealed ?? false)
const reducedMotion = usePreferredReducedMotion()

// A rapid enter/leave toggle mid-transition made each letter jump straight to
// the new target instead of finishing its current move — looked "frozen"
// (transition-delay is re-evaluated on every direction change, so a letter
// already arrived would still wait out its original entrance delay before
// reversing). `interrupted` disables the per-letter stagger for exactly the
// transition that interrupts another one still in flight, so it snaps back
// as a single uniform move instead — the normal cascade returns as soon as
// a toggle starts from a fully settled state.
const interrupted = ref(false)

let settleTimeout: ReturnType<typeof setTimeout> | null = null

watch(() => props.revealed, (value) => {
    const target = value ?? false
    if (target === appliedRevealed.value) return

    interrupted.value = settleTimeout !== null
    if (settleTimeout) clearTimeout(settleTimeout)

    appliedRevealed.value = target

    if (reducedMotion.value === 'reduce') return

    const totalDurationMs = interrupted.value
        ? durationMs.value
        : durationMs.value + Math.max(0, chars.value.length - 1) * staggerMs.value

    settleTimeout = setTimeout(() => {
        settleTimeout = null
        interrupted.value = false
    }, totalDurationMs)
})

const effectiveStaggerMs = computed(() => interrupted.value ? 0 : staggerMs.value)

onBeforeUnmount(() => {
    if (settleTimeout) clearTimeout(settleTimeout)
})
</script>

<template>
    <span
        :class="$style.root"
        :style="{ '--v-animated-text-duration': `${durationMs}ms`, '--v-animated-text-stagger': `${effectiveStaggerMs}ms` }"
    >
        <template v-if="swap">
            <span
                v-for="(char, index) in chars"
                :key="index"
                :class="[$style.cell, appliedRevealed && $style['cell--swapped']]"
                :style="{ '--char-index': index }"
            >
                <span :class="[$style.line, $style['line--current']]">{{ char === ' ' ? '\u00A0' : char }}</span>
                <span
                    :class="[$style.line, $style['line--incoming']]"
                    aria-hidden="true"
                >{{ char === ' ' ? '\u00A0' : char }}</span>
            </span>
        </template>
        <VSplitText
            v-else
            render="chars"
            :class="[$style.char, appliedRevealed && $style['char--revealed']]"
            :content="content"
        />
    </span>
</template>

<style lang="scss" module>
.root {
    display: inline-block;
    overflow: hidden;
}

.char {
    display: inline-block;
    translate: 0 -100%;

    @media (prefers-reduced-motion: no-preference) {
        transition: var(--v-animated-text-duration) ease(out-quad);
        transition-delay: calc(var(--data-char-index, 0) * var(--v-animated-text-stagger));
        transition-property: translate;
    }

    &--revealed {
        translate: 0 0;
    }
}

.cell {
    position: relative;
    display: inline-block;
    overflow: hidden;
    height: 1lh;
    vertical-align: top;

    &--swapped {
        .line--current {
            translate: 0 -100%;
        }

        .line--incoming {
            translate: 0 0;
        }
    }
}

.line {
    display: block;

    @media (prefers-reduced-motion: no-preference) {
        transition: var(--v-animated-text-duration) ease(out-quad);
        transition-delay: calc(var(--char-index, 0) * var(--v-animated-text-stagger));
        transition-property: translate;
    }

    &--current {
        translate: 0 0;
    }

    &--incoming {
        position: absolute;
        inset: 0;
        translate: 0 100%;
    }
}
</style>
