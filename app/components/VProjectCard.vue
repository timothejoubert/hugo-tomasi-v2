<script lang="ts" setup>
import type { ProjectPageDocument } from '~~/prismicio-types'
import type { VWrapperElement } from '~/components/VWrapper.vue'
import { getRoutePath } from '~~/shared/prismic-schema'

const props = defineProps<{
	project: ProjectPageDocument
	wrapper?: VWrapperElement
}>()

const data = computed(() => props.project.data)
const tags = computed(() => {
	if (props.project.data?.tag_group?.length) return props.project.data.tag_group.filter(item => item.tag).map(item => item.tag as string)
	return props.project.tags.filter(t => t) as string[]
})

const orderedTags = computed(() => {
	return [...tags.value]?.sort((a, b) => a.length - b.length)
})

const img = computed(() => data.value?.thumbnail || data.value?.main_media)
</script>

<template>
    <VWrapper
        :wrapper="wrapper || 'div'"
        :class="$style.root"
    >
        <h2
            v-if="data.title"
            :class="$style.title"
        >
            <VPrismicLink
                :to="getRoutePath('project_page', { uid: project.uid })"
                :class="$style.link"
            >
                {{ data.title }}
            </VPrismicLink>
        </h2>
        <div
            v-if="orderedTags && orderedTags.length"
            :class="$style.tags"
        >
            <VTag
                v-for="(tag, i) in orderedTags"
                :key="tag"
                :class="$style.tag"
                :label="tag"
                :style="{ '--tag-index': orderedTags.length - i }"
            />
        </div>
        <VPrismicImg
            v-if="img"
            :field="img"
            :width="400"
            :height="400"
            sizes="xs:92vw sm:92vw md:30vw lg:22vw xl:22vw hq:22vw qhd:22vw"
            :modifiers="{
                fit: 'crop',
                ar: '1:1',
            }"
            :class="$style.img"
        />
    </VWrapper>
</template>

<style lang="scss" module>
$card-padding: 16px;

.root {
    position: relative;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    padding: $card-padding;
    border-radius: 0 42px 0 0;
    aspect-ratio: 1;
    isolation: isolate;

    &::before {
        position: absolute;
        z-index: 1;
        background: linear-gradient(20deg, rgb(0, 0, 0, 90%) 10%, rgb(0, 0, 0, 15%) 100%);
        content: '';
        inset: 0;
        opacity: 1;
        pointer-events: none;

        @media (prefers-reduced-motion: no-preference) {
            transition: opacity 0.4s ease(out-quad);
        }
    }

    @media (hover: hover) {
        &:hover::before {
            opacity: 0.5;
        }
    }
}

.title {
    z-index: 1;
    order: 2;
    margin: 12px 0 0;
    font-size: 16px;
    font-weight: 700;
}

.link {
    color: var(--color-content);
    text-decoration: none;

    &::before {
        position: absolute;
        content: '';
        inset: 0;
    }
}

.tags {
    z-index: 1;
    display: flex;
    flex-flow: column wrap;
    align-items: flex-start;
    order: 1;
    margin-top: auto;
    gap: 6px;
}

.tag {
    margin: initial;
    translate: calc(-100% - 20px) 0;

    @media (prefers-reduced-motion: no-preference) {
        transition: translate 0.3s ease(out-quart) calc(var(--tag-index) * 40ms);
    }

    @media (hover: hover) {
        .root:hover & {
            translate: 0;
        }
    }
}

.img {
    position: absolute;
    z-index: -1;
    filter: grayscale(1);
    inset: 0;

    @media (prefers-reduced-motion: no-preference) {
        transition-duration: 0.3s;
        transition-property: filter, scale;
        transition-timing-function: ease(out-quart);
    }

    @media (hover: hover) {
        .root:hover & {
            filter: grayscale(0);
            scale: 1.05;
        }
    }
}
</style>
