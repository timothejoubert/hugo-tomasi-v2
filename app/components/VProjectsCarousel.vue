<script setup lang="ts">
import type { ProjectPageDocument } from '~~/prismicio-types'
import type { VWrapperElement } from '~/components/VWrapper.vue'
import { getRoutePath } from '~~/shared/prismic-schema'

defineProps<{
    wrapper?: VWrapperElement
    title?: string
    projects: ProjectPageDocument[]
}>()

const carousel = ref<HTMLElement | null>(null)
const { isDown, mouseMove, isCarouselEnable, progress, scrollByStep } = useNativeCarousel(carousel)
</script>

<template>
    <VWrapper
        :wrapper="wrapper || 'section'"
        :class="$style.root"
    >
        <div
            :class="$style.head"
            class="grid-container"
        >
            <h2
                v-if="title"
                class="text-h3"
                :class="$style.title"
            >
                {{ title }}
            </h2>
            <NuxtLink
                :to="getRoutePath('project_listing_page')"
                :class="$style.link"
            >
                <VButton
                    :label="$t('see_all_project')"
                    design="filled"
                    size="sm"
                    icon-name="material-symbols:arrow-forward"
                />
            </NuxtLink>
            <div
                v-show="isCarouselEnable"
                :class="$style.nav"
            >
                <div :class="$style['nav-buttons']">
                    <VButton
                        design="outlined"
                        icon-name="material-symbols:arrow-back"
                        :class="$style['nav-button']"
                        :disabled="progress <= 0"
                        @click="scrollByStep(-1)"
                    />
                    <VButton
                        design="outlined"
                        icon-name="material-symbols:arrow-forward"
                        :class="$style['nav-button']"
                        :disabled="progress >= 1"
                        @click="scrollByStep(1)"
                    />
                </div>
                <div
                    :class="$style.scroll"
                    :style="{ '--progress': progress }"
                />
            </div>
        </div>
        <ul
            ref="carousel"
            :class="[
                $style.carousel,
                mouseMove && $style['carousel--is-dragging'],
                isDown && $style['carousel--no-snap'],
            ]"
        >
            <VProjectCard
                v-for="project in projects"
                :key="project.uid"
                :project="project"
                :class="$style.card"
                wrapper="li"
            />
        </ul>
    </VWrapper>
</template>

<style lang="scss" module>
.root {
    overflow: hidden;
    background-color: var(--color-background);
    color: var(--color-content);
}

.head {
    display: flex;
    align-items: flex-start;
    margin-bottom: 22px;
}

.title {
    margin-block: 0;
}

.link {
    align-self: center;
    margin-right: auto;
    margin-left: 16px;
}

.nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: auto;
    gap: 10px;
}

.nav-buttons {
    display: flex;
    gap: 8px;
}

.nav-button {
    border-radius: 999px;

    &:disabled {
        cursor: default;
        opacity: 0.35;
    }
}

.scroll {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 6px;
    border-radius: 6px;
    background-color: color-mix(in srgb, var(--color-content) 10%, var(--color-background));

    &::after {
        position: absolute;
        background-color: var(--color-content);
        content: '';
        inset: 0;
        scale: var(--progress, 0) 1;
        transform-origin: left;
        transition: scale 0.1s;
    }
}

.carousel {
    display: flex;
    min-width: 100%;
    margin: 0;
    cursor: grab;
    -webkit-overflow-scrolling: touch;
    overflow-x: scroll;
    padding-inline: var(--grid-margin);
    scroll-padding-inline: var(--grid-margin);
    scroll-snap-type: x mandatory;
    scrollbar-width: none; /* Firefox 64 */
    touch-action: pan-x;

    &::-webkit-scrollbar {
        display: none;
    }

    // The mouse-drag emulation below sets `scrollLeft` directly (not a native scroll gesture) —
    // with `scroll-snap-type: mandatory` active, browsers snap back to the nearest slide on every
    // intermediate assignment, which blocks the drag entirely. Snapping is restored on mouse up,
    // when `snapToNearest()` (use-native-carousel.ts) explicitly re-snaps.
    &--no-snap {
        scroll-snap-type: none;
    }
}

.card {
    width: flex-grid(11, 12);
    flex-shrink: 0;
    margin-right: var(--gutter);
    scroll-snap-align: start;
    scroll-snap-stop: always;

    .carousel--is-dragging & {
        pointer-events: none;
    }

    @include media('>=md') {
        width: flex-grid(6, 12);
    }

    @include media('>=vl') {
        width: flex-grid(4, 12);
    }
}

.media {
    width: 100%;
    border-radius: 22px;
}
</style>
