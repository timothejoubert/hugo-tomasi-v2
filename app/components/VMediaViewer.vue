<script lang="ts" setup>
import { VCarousel } from '#components'
import type { PlayableRef } from '~/components/VPrismicMedia.vue'

const { isOpen, items, startIndex, close } = useMediaViewer()

const hasMultiple = computed(() => items.value.length > 1)

const dialogEl = useTemplateRef<HTMLDialogElement>('dialogEl')
const carouselEl = useTemplateRef<InstanceType<typeof VCarousel>>('carouselEl')
const scrollLock = useScrollLock(import.meta.client ? document.body : null)

// Plain (non-reactive) registry, not template state — v-for's `:ref` callback keeps it in sync
// with whichever slides are currently mounted; nothing here needs to trigger a re-render.
const mediaRefs: Record<number, PlayableRef | null> = {}

function setMediaRef(el: unknown, index: number) {
    mediaRefs[index] = el as PlayableRef | null
}

function playSlide(index: number | undefined) {
    if (index === undefined) return
    mediaRefs[index]?.play?.()
}

function pauseSlide(index: number | undefined) {
    if (index === undefined) return
    mediaRefs[index]?.pause?.()
}

watch(isOpen, async (open) => {
    if (open) {
        dialogEl.value?.showModal()
        // The carousel track only exists once `items` render — wait a tick before jumping to the
        // clicked item, and do it without animating (it's the dialog's opening state, not a nav).
        await nextTick()
        carouselEl.value?.scrollToIndex(startIndex.value, 'instant')
        // Reliable for native <video> (imperative .play() on a same-document element, right after
        // a user gesture). Embeds instead autoplay via the `:autoplay` binding below, which bakes
        // `autoplay=1` into the iframe's own src — a postMessage `playVideo()` sent this early
        // arrives before the iframe's player has finished initializing and is silently dropped.
        playSlide(startIndex.value)
    }
    else {
        dialogEl.value?.close()
    }
    scrollLock.value = open
})

// Whichever slide a video was playing on, leaving it (by drag, wheel, or the nav buttons — not
// just the auto-play above) should stop that video rather than let it keep playing off-screen.
watch(() => carouselEl.value?.activeIndex, (newIndex, oldIndex) => {
    if (oldIndex !== undefined && oldIndex !== newIndex) pauseSlide(oldIndex)
})

function onDialogClose() {
    pauseSlide(carouselEl.value?.activeIndex)
    close()
}

function onBackdropClick(e: MouseEvent) {
    if (e.target === dialogEl.value) dialogEl.value?.close()
}

const { themeClass } = useThemeProvider({ preferredTheme: 'dark' })
</script>

<template>
    <dialog
        ref="dialogEl"
        :class="[$style.root, themeClass]"
        @close="onDialogClose"
        @click="onBackdropClick"
    >
        <div
            :class="$style.content"
            @click.stop
        >
            <VButton
                design="filled"
                icon-name="material-symbols:close"
                :class="$style.close"
                @click="close"
            />
            <VCarousel
                v-if="items.length"
                ref="carouselEl"
                :class="$style.carousel"
            >
                <template
                    v-if="hasMultiple"
                    #nav="{ scrollByStep }"
                >
                    <VButton
                        design="filled"
                        icon-name="material-symbols:arrow-back"
                        :class="$style.prev"
                        @click="scrollByStep(-1)"
                    />
                    <VButton
                        design="filled"
                        icon-name="material-symbols:arrow-forward"
                        :class="$style.next"
                        @click="scrollByStep(1)"
                    />
                </template>
                <li
                    v-for="(item, index) in items"
                    :key="index"
                    :class="$style.slide"
                >
                    <VPrismicMedia
                        :ref="(el) => setMediaRef(el, index)"
                        :field="item.field"
                        :autoplay="index === startIndex"
                        :class="$style.media"
                    />
                </li>
            </VCarousel>
        </div>
    </dialog>
</template>

<style lang="scss" module>
.root {
    @include theme-variants;

    position: fixed;
    display: none;
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    padding: 0;
    border: none;
    margin: 0;
    background-color: var(--color-background);
    color: var(--color-content);
    inset: 0;

    &[open] {
        display: flex;
    }
}

.content {
    position: relative;
    width: 100%;
    height: 100%;
}

.carousel {
    --v-carousel-gap: 0px;
    --v-carousel-padding-inline: 0px;

    height: 100%;
}

.slide {
    display: flex;
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    padding: var(--grid-margin);
    scroll-snap-align: start;
    scroll-snap-stop: always;
}

.media {
    max-width: 100%;
    max-height: 100%;

    :where(video, img) {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
}

.close {
    position: absolute;
    z-index: 1;
    top: var(--grid-margin);
    right: var(--grid-margin);
}

.prev,
.next {
    position: absolute;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
}

.prev {
    left: var(--grid-margin);
}

.next {
    right: var(--grid-margin);
}
</style>
