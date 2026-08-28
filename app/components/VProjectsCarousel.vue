<script setup lang="ts">
import type { PropType } from 'vue'
import type { ProjectPageDocument } from '~~/prismicio-types'
import { getRoutePath } from '~~/shared/prismic-schema'

defineProps({
	tag: String,
	title: String,
	projects: Array as PropType<ProjectPageDocument[]>,
})

const carousel = ref<HTMLElement | null>(null)
const { mouseMove, isCarouselEnable, progress } = useNativeCarousel(carousel)
</script>

<template>
    <component
        :is="tag || 'div'"
        :class="$style.root"
        class="slice-container--fullwidth"
    >
        <div
            class="container--fullwidth"
            :class="$style.head"
        >
            <div
                v-if="title"
                class="text-h4"
                :class="$style.title"
            >
                {{ title }}
            </div>
            <NuxtLink
                :to="getRoutePath('project_listing_page')"
                :class="$style.link"
            >
                <VButton
                    :label="$t('see_all_project')"
                    design="outlined"
                    icon-name="material-symbols:arrow-forward"
                    size="s"
                />
            </NuxtLink>
            <div
                v-show="isCarouselEnable"
                :class="$style.scroll"
                :style="{ '--progress': progress }"
            />
        </div>
        <div
            ref="carousel"
            :class="[$style.carousel, mouseMove && $style['carousel--is-dragging']]"
            class="container--fullwidth"
        >
            <VProjectCard
                v-for="project in projects"
                :key="project.uid"
                :project="project"
                :class="$style.card"
            />
        </div>
    </component>
</template>

<style lang="scss" module>
.root {
  overflow: hidden;
}

.head {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.title {
  // margin-bottom: 20px;
  // opacity: 0.6;
  // text-transform: uppercase;
}

.link {
  margin-right: auto;
  margin-left: 16px;
  justify-self: end;
}

.scroll {
  position: relative;
  overflow: hidden;
  width: 80px;
  height: 2px;
  border-radius: 1px;
  background-color: lightgray;
  grid-column: 2;
  justify-self: end;

  &::after {
    position: absolute;
    background-color: rgb(0, 0, 0, 90%);
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
  cursor: grab;
  -webkit-overflow-scrolling: touch;
  overflow-x: scroll;
  scrollbar-width: none; /* Firefox 64 */
  touch-action: pan-x;

  &::-webkit-scrollbar {
    display: none;
  }
}

.card {
  --v-card-date-display: none;

  width: 85%;
  flex-shrink: 0;
  margin-right: 20px;

  .carousel--is-dragging & {
    pointer-events: none;
  }

  @include media('>=md') {
    width: calc(50% - var(--page-gutter) * 0.5 - 5px);
  }
}

.media {
  width: 100%;
  border-radius: 22px;
}
</style>
