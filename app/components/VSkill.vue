<script setup lang="ts">
import type { RichTextField } from '@prismicio/types'
// import VTransitionExpand from '~/components/atoms/VTransitionExpand/VTransitionExpand.vue'

export interface VSkillProps {
	title: string | null
	content: string | RichTextField
	sideTitle: string | null
	sideContent: string | RichTextField
}

defineProps<VSkillProps>()
const isOpened = ref(false)
const isHoveringHead = ref(false)

const id = `collapsable-${useId()}`
</script>

<template>
    <div :class="[$style.root, isOpened && $style['root--open']]">
        <div
            :class="$style.head"
            :aria-controls="id"
            :aria-expanded="isOpened"
            @click="isOpened = !isOpened"
            @mouseleave="isHoveringHead = false"
            @mouseenter="isHoveringHead = true"
        >
            <VButton
                design="filled"
                :class="$style.button"
                :play-animation="isHoveringHead"
            >
                <template #icon="{ iconClass }">
                    <div :class="[$style.icon, iconClass]" />
                </template>
            </VButton>
            <div
                v-if="title"
                :class="$style.title"
                class="text-h3"
            >
                {{ title }}
            </div>
        </div>
        <div
            :id="id"
            :class="$style.body"
        >
            <div :class="$style.body__inner">
                <VText
                    :content="content"
                    :class="$style.content"
                    class="text-body-s"
                />
                <div
                    v-if="sideTitle"
                    :class="$style['side-title']"
                    class="text-over-title-s"
                >
                    {{ sideTitle }}
                </div>
                <VText
                    v-if="sideContent"
                    :class="$style['side-content']"
                    class="text-body-s"
                    :content="sideContent"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.root {
  position: relative;
}

.head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  cursor: pointer;
  gap: 10px 30px;

  @include media('>=md') {
    flex-wrap: nowrap;
  }
}

.button {
  min-width: 72px;
}

.icon {
  position: relative;
  display: flex;
  width: 1rem;
  height: 1rem;
  align-items: center;

  &::before,
  &::after {
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: currentcolor;
    content: '';
    transform-origin: center;
    transition:
      background-color 0.3s,
      rotate 0.2s,
      opacity 0.2s;
  }

  .root:not(.root--open) &::after {
    rotate: 90deg;
  }

  .root--open &::after {
    opacity: 0;
  }
}

.title {
  width: 100%;
  max-width: 550px;
  text-transform: uppercase;

  @include media('>=md') {
    width: initial;
    max-width: initial;
  }
}

.body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s ease(out-quad);

  .root--open & {
    grid-template-rows: 1fr;
  }
}

.body__inner {
  display: grid;
  overflow: hidden;
  grid-auto-flow: dense;
  grid-template-columns: 1fr;

  @include media('>=md') {
    max-width: 90ch;
    gap: 14px 40px;
    grid-template-columns: 2fr minmax(270px, 1fr);
  }
}

.content {
  max-width: 50ch;
  padding-top: 32px;

  @include media('>=md') {
    margin-bottom: 32px;
    margin-left: 104px;
    grid-row: 1 / 4;
  }
}

.side-title {
  padding-top: 32px;
}

.side-content {
  line-height: 1.4;
  opacity: 0.7;
}
</style>
