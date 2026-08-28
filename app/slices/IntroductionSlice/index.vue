<script setup lang="ts">
import { type Content } from '@prismicio/client'
import type { FilledLinkToMediaField, ImageField, RTTextNodeBase } from '@prismicio/types'

interface Item {
  type: 'text' | 'media'
  media?: ImageField | FilledLinkToMediaField
  content?: string
}

const props = defineProps(getSliceComponentProps<Content.IntroductionSliceSlice>())

const MEDIA_INCLUDE_SYMBOL = '[]'

const isVisible = ref(false)

const text = computed((): string | undefined => {
  return (props.slice.primary.content?.[0] as RTTextNodeBase)?.text
})

const medias = computed(() => {
  return props.slice.items.filter((item) => item?.medias?.url).map((item) => item.medias as FilledLinkToMediaField)
})

const content = computed((): Item[] => {
  if (!text.value) return []
  const result: Item[] = []

  const textList = text.value.split(MEDIA_INCLUDE_SYMBOL)

  textList.forEach((text: string, i: number) => {
    result.push({ type: 'text', content: text.trim() })
    if (medias.value?.[i]) result.push({ type: 'media', media: medias.value[i] })
  })

  return result
})

const root = ref<HTMLElement | null>(null)
let observer: undefined | IntersectionObserver

function initIntersectionObserver() {
  if (!root.value) return

  observer = new IntersectionObserver(([entry]) => (isVisible.value = entry.isIntersecting), {
    rootMargin: '-10% 0% -10% 0%',
  })
  observer.observe(root.value)
}

function disposeIntersectionObserver() {
  observer?.disconnect()
  observer = undefined
}

watch(root, (el) => {
  if (el && !observer) initIntersectionObserver()
})

onMounted(initIntersectionObserver)
onBeforeUnmount(disposeIntersectionObserver)
</script>

<template>
  <section
    v-if="content"
    ref="root"
    :class="[$style.root, isVisible && $style['root--visible']]"
    class="slice-container-xl"
  >
    <div :class="$style.wrapper" class="text-h4">
      <component
        :is="item.type === 'text' ? 'span' : 'div'"
        v-for="(item, i) in content"
        :key="i"
        :class="[$style.item, item.type === 'text' ? $style['item--text'] : $style['item--media']]"
      >
        <template v-if="item.type === 'text'" preserveWhitespace="false">{{ item.content }}</template>
        <NuxtImg
          v-else-if="item.media"
          :src="item.media.url"
          width="600"
          height="390"
          provider="imgix"
          placeholder="/images/placeholder.jpg"
          :class="$style.image"
          fit="cover"
          :modifiers="{ crop: 'edges' }"
          sizes="200px"
        />
      </component>
    </div>
  </section>
</template>

<style lang="scss" module>
.root {
  // @include margin-block;
}

.wrapper {
  line-height: 1.1;
  margin-inline: auto;

  @include media('>=lg') {
    width: max(200px, 27ch);
    text-align: center;
  }
}

.item {
  &--media {
    position: absolute;
    display: none;
  }

  &--text {
    margin-right: 9px;
  }

  @include media('>=lg') {
    &--media {
      position: relative;
      top: 2px;
      display: inline-flex;
      overflow: hidden;
      width: 42px;
      height: 42px;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background-color: lightgrey;
      margin-inline: 16px;
      transition: width 0.5s ease(out-quad);
    }

    .root--visible &--media {
      width: 96px;
    }

    &--text {
      margin-right: initial;
    }
  }
}

.image {
  position: absolute;
  width: 100%;
  height: calc(100% + #{20px});
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease(out-quad);

  .root--visible & {
    opacity: 1;
  }
}
</style>
