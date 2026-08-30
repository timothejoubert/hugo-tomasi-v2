<script lang="ts" setup>
import type { ProjectPageDocument } from '~~/prismicio-types'
import type { VWrapperElement } from '~/components/VWrapper.vue'
import { getRoutePath } from '~~/shared/prismic-schema'

const props = defineProps<{
	project: ProjectPageDocument
	wrapper?: VWrapperElement
	titleClass?: string
}>()

const data = computed(() => props.project.data)
const tags = computed(() => {
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
			:class="[$style.title, titleClass]"
		>
			<VPrismicLink
				:to="getRoutePath('project_page', { uid: project.uid })"
				:class="$style.link"
			>
				{{ data.title }}
			</VPrismicLink>
		</h2>
        <div :class="$style['image-wrapper']">
            <VPrismicImg
                v-if="img"
                :field="img"
                :width="1600"
                :height="900"
                sizes="xs:92vw sm:92vw md:80vw lg:70vw xl:70vw hq:70vw qhd:70vw"
                :modifiers="{ fit: 'crop' }"
                :class="$style.img"
            />
			<div
				v-if="orderedTags && orderedTags.length"
				:class="$style['tags']"
			>
				<VTag
					v-for="(tag, i) in orderedTags"
					:key="tag"
					:label="tag"
					filled
				/>
			</div>
			<VButton
				:class="$style.cta"
				tag="span"
				design="filled"
				theme="dark"
				icon-name="material-symbols:arrow-outward"
			/>
        </div>
    </VWrapper>
</template>

<style lang="scss" module>
.root {
    position: relative;
	display: flex;
	flex-direction: column;
}

.title {
	order: 2;
	margin-left: 12px;
    margin-block: 12px 0;
}

.link {
    color: var(--color-content);
    text-decoration: none;

    &::before {
        position: absolute;
		z-index: 2;
        content: '';
        inset: 0;
    }
}


.image-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 19px;
    aspect-ratio: 16 / 9;
	container-type: size;

	&::after {
		position: absolute;
		background: linear-gradient(4deg,rgb(0, 0, 0, 60%) 10%, rgb(0, 0, 0, 0%) 30%);
		content: '';
		inset: 0;
		pointer-events: none;
	}
}

.img {
    position: absolute;
    inset: 0;
	transition-duration: 0.3s;
	transition-property: scale;
	transition-timing-function: ease(out-quart);


    @media (hover: hover) {
        .root:hover & {
            scale: 1.05;
        }
    }
}

.cta {
    position: absolute;
	z-index: 1;
    right: min(3cqw, 20px);
    bottom: min(5cqh, 20px);
	opacity: 0;
	transition: opacity 0.3s ease(out-quad);

	@media (hover: hover) {
        .root:hover & {
            opacity: 1;
        }
    }
}

.tags {
	position: absolute;
    z-index: 1;
	bottom: min(5cqh, 20px);
	left: min(3cqw, 20px);
    display: flex;
	flex-wrap: wrap;
    align-items: flex-start;
    gap: 6px;
}

.tag {
    margin: initial;
}
</style>
