<script lang="ts" setup>
import type { Content } from '@prismicio/client'
import type { FilledLinkToMediaField } from '@prismicio/types'

const props = defineProps(getSliceComponentProps<Content.MarqueeSliceSlice>(['slice', 'index', 'slices', 'context']))

const medias = computed(() => props.slice.items || [])
const mediaListRow = computed(() => {
	const filteredMedias = medias.value
		.filter(item => item.media?.url)
		.map(item => item.media as FilledLinkToMediaField)

	if (!filteredMedias.length) return []

	return filteredMedias.reduce((acc: FilledLinkToMediaField[][], curr: FilledLinkToMediaField, index) => {
		if (index % 6 === 0) {
			acc.push([curr])
		}
		else {
			acc[acc.length - 1].push(curr)
		}

		return acc
	}, [])
})

const hasMedia = computed(() => !!mediaListRow.value?.[0])
</script>

<template>
    <section
        v-if="hasMedia"
        :class="$style.root"
    >
        <LazyVMarquee
            v-for="(row, i) in mediaListRow"
            :id="`row-${i}-${row[0].id}`"
            :key="i + row[0].url"
            :space="18"
            :class="$style.marquee"
            :speed="40000"
            :reverse="!!(i % 2)"
        >
            <VPrismicImg
                v-for="(media, mediaIndex) in row"
                :key="mediaIndex + media.url"
                :field="media"
                width="600"
                height="390"
                :class="$style.media"
                sizes="xs:40vw md:40vw vl:35vw"
            />
        </LazyVMarquee>
    </section>
</template>

<style lang="scss" module>
.root {
  margin-block: 320px;
  overflow-x: hidden;
}

.marquee {
  display: flex;
  min-width: 100vw;
  margin-block: 18px;
}

.media {
  width: 300px;
  max-width: initial;
  flex-shrink: 0;
  border-radius: 6px;
  margin-right: 50px;
}
</style>
