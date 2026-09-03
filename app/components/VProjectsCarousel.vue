<script setup lang="ts">
import type { ProjectPageDocument } from '~~/prismicio-types'
import type { VWrapperElement } from '~/components/VWrapper.vue'
import { getRoutePath } from '~~/shared/prismic-schema'

defineProps<{
    wrapper?: VWrapperElement
    title?: string
    projects: ProjectPageDocument[]
}>()
</script>

<template>
    <VWrapper
        :wrapper="wrapper || 'section'"
        :class="$style.root"
    >
        <VCarousel>
            <template #nav="{ progress, isCarouselEnable, scrollByStep }">
                <div
                    :class="$style.head"
                    class="grid-container"
                >
                    <h2
                        v-if="title"
                        class="text-h4"
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
            </template>
            <template #default="{ isDragging }">
                <VProjectCard
                    v-for="project in projects"
                    :key="project.uid"
                    :project="project"
                    :class="[$style.card, isDragging && $style['card--dragging']]"
                    wrapper="li"
                />
            </template>
        </VCarousel>
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
    height: 4px;
    border-radius: 50vmax;
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

.card {
    width: flex-grid(11, 12);
    flex-shrink: 0;
    scroll-snap-align: start;
    scroll-snap-stop: always;

    &--dragging {
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
