<script lang="ts" setup>
import { isFilled } from '@prismicio/client'
import type { HomePageDocumentData } from '~~/prismicio-types'

interface VHeaderHomeProps {
	pageData: HomePageDocumentData
}

const props = defineProps<VHeaderHomeProps>()
const isCtaHovered = ref(false)

const mediaField = computed(() => isFilled.embed(props.pageData?.embed_video) ? props.pageData.embed_video : props.pageData?.media)

const hasVideo = computed(() => !!mediaField.value && (
	isFilled.embed(props.pageData?.embed_video) || isFilled.linkToMedia(props.pageData?.media)
))

// TODO: Add media viewer
const loading = ref(false)
</script>

<template>
    <header
        v-if="pageData"
        :class="$style.root"
        class="grid-extended"
    >
        <h1
            v-if="pageData.title"
            class="text-h1"
			:class="$style.title"
        >
            {{ pageData.title }}
        </h1>
        <VText
            v-if="pageData.subtitle"
            :content="pageData.subtitle"
            :class="$style.tagline"
            class="text-h4"
            tag="p"
        />
        <div :class="$style['media-wrapper']">
            <VPrismicMedia
                v-if="hasVideo"
                :field="mediaField"
                :class="$style.video"
                playsinline
                background
				loop
                fit="cover"
            />
        </div>
		<p
			v-if="pageData.sub_section_title"
			:class="$style['sub-title']"
			class="text-over-title-s"
		>
			{{ pageData.sub_section_title }}
			<VLoadingDots v-if="loading" />
		</p>
		<VAnimatedButton
			v-if="hasVideo"
			:label="$t('showreel.cta_label')"
			:class="$style['video-button']"
			icon="material-symbols:fullscreen"
		/>
		<hr :class="$style.line" />
        <VText
			v-if="pageData?.sub_section_content"
            :class="$style['content-main']"
			class="text-body-s"
            :content="pageData.sub_section_content"
        />
        <VText
			v-if="pageData?.sub_section_aside"
            :class="$style['content-alt']"
            class="text-body-s"
            :content="pageData.sub_section_aside"
        />
    </header>
</template>

<style lang="scss" module>
.root {
	@include theme('dark');

	position: relative;
	padding-bottom: 16px;
	color: var(--color-content);
	isolation: isolate;

	&::before {
		position: absolute;
		z-index: -5;
		background-color: var(--color-background);
		content: '';
		inset: calc(var(--v-main-nav-min-height) * -1) 0 0;
		pointer-events: none;

	}
}

.title {
	grid-column: 1 / -1;
	margin-block: 0;
}

.tagline {
	grid-column: 1 / -1;
  	margin-block: 22px;

	@include media('>=md') {
		max-width: 25ch;
	}
}

.media-wrapper {
	--v-player-video-max-width: none !important;

	position: relative;
	z-index: -2;
	width: calc(100% + var(--grid-margin) * 2);
	margin-left: calc(var(--grid-margin) * -1);
	grid-column: 1 / -1;
	pointer-events: none;

  &::after {
    position: absolute;
    background-color: color-mix(in srgb, var(--color-background) 55%, transparent);
    content: '';
    inset: 0 0 -2px;
    pointer-events: none;
  }
}

.sub-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1PX solid rgb(255, 255, 255, 30%);
  grid-column: 1 / -1;
}

.sub-title {
	grid-column: 1 / -1;

	@include media('>=md') {
		grid-column: 1 / span 5;
	}
}

.video-button {
	grid-column: 1 / -1;

	@include media('>=md') {
		grid-column: 9 / -1;
	}
}

.line {
    width: 100%;
    height: 1PX;
	border: none;
    background-color: rgb(255, 255, 255, 30%);
    grid-column: 1 / -1;
    margin-block: 1rem;
    margin-block: 0;

}

.content-main {
	max-width: 46ch;
	grid-column: 1 / -1;

	@at-root .content-main:not(strong),
	& *:not(strong) {
		opacity: 0.7;
	}

	@include media('>=md') {
		grid-column: 1 / span 5;
	}
}

.content-alt {
	max-width: 46ch;
	grid-column: 1 / -1;

	& *:not(strong) {
		opacity: 0.7;
	}

	@include media('>=md') {
		grid-column: 9 / -1;
	}
}
</style>
