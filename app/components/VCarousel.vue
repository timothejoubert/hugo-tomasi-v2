<script lang="ts" setup>
const carouselEl = useTemplateRef<HTMLElement>('carouselEl')
const { isDown, mouseMove, isCarouselEnable, progress, activeIndex, scrollByStep, scrollToIndex } = useNativeCarousel(carouselEl)

defineExpose({ scrollByStep, scrollToIndex, progress, isCarouselEnable, activeIndex })
</script>

<template>
    <slot
        name="nav"
        :progress="progress"
        :is-carousel-enable="isCarouselEnable"
        :scroll-by-step="scrollByStep"
    />
    <ul
        ref="carouselEl"
        v-bind="$attrs"
        :class="[
            $style.carousel,
            isDown && $style['carousel--no-snap'],
        ]"
    >
        <slot :is-dragging="mouseMove" />
    </ul>
</template>

<style lang="scss" module>
.carousel {
    display: flex;
    min-width: 100%;
    margin: 0;
    cursor: grab;
    gap: var(--v-carousel-gap, var(--gutter));
    -webkit-overflow-scrolling: touch;
    overflow-x: scroll;
    padding-inline: var(--v-carousel-padding-inline, var(--grid-margin));
    scroll-padding-inline: var(--v-carousel-padding-inline, var(--grid-margin));
    scroll-snap-type: x mandatory;
    scrollbar-width: none; /* Firefox 64 */
    touch-action: pan-x;

    &::-webkit-scrollbar {
        display: none;
    }

    // The mouse-drag emulation in use-native-carousel.ts sets `scrollLeft` directly (not a native
    // scroll gesture) — with `scroll-snap-type: mandatory` active, browsers snap back to the
    // nearest slide on every intermediate assignment, which blocks the drag entirely. Snapping is
    // restored on mouse up, when `snapToNearest()` explicitly re-snaps.
    &--no-snap {
        scroll-snap-type: none;
    }
}
</style>
