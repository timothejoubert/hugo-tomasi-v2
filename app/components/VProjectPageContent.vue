<script lang="ts" setup>
import type { ProjectPageDocument } from '~~/prismicio-types'

const props = defineProps<{
    document?: ProjectPageDocument | null
}>()

const { phase } = usePageIntro()
const revealed = computed(() => phase.value === 'page' || phase.value === 'done')

const project = computed(() => props.document?.data)
const prismic = usePrismic()

const medias = computed(() => {
    if (!project.value) return []

    return project.value.medias?.filter(m => prismic.isFilled.linkToMedia(m.media) && m.media.url)
})

const tags = computed(() => {
    if (project.value?.tag_group?.length) {
		return project.value.tag_group?.filter(item => item.tag).map(item => item.tag)
	}

    return props.document?.tags || []
})
</script>

<template>
	<template v-if="document">
		<div
			:class="[
				$style['content-wrapper'],
			]"
		>
			<div :class="$style.content">
				<div :class="$style.attributes">
					<ul v-if="tags && tags.length" :class="$style.tags">
						<LazyVTag
							v-for="(tag, i) in tags"
							:key="tag || i"
							:label="tag"
							wrapper="li"
						/>
					</ul>
					<VTime
						:date="project?.date"
						format="short"
					/>
				</div>
				<LazyVText
					v-if="project?.short_description"
					:content="project.short_description"
					:class="$style['short-description']"
				/>
				<LazyVText
					v-if="project?.content"
					:content="project.content"
					:class="$style.description"
				/>
			</div>

			<VPrismicImg :field="project?.thumbnail" />

			<div v-if="medias && medias.length" :class="$style.medias">
				<div
					v-for="(mediaGroup, i) in medias"
					:key="`media-${i}`"
					:class="$style.media"
				>
					<VPrismicMedia :field="mediaGroup.media" background />
				</div>
			</div>
			<VProjectNeighbors
				v-if="document"
				:document="document"
			/>
		</div>
	</template>
	<VErrorContent
		v-else
		:class="$style['not-found']"
		:full-page="false"
		:subtitle="$t('error_status', { code: 404 })"
		:content="$t('error_page.project_not_found_content')"
	/>
</template>

<style lang="scss" module>
.root {
    --v-project-page-padding-inline: 16px;

    z-index: 11;
    top: var(--app-padding-top);
    right: var(--app-padding-right);
	left: var(--app-padding-left);
    overflow: hidden auto;
    max-width: var(--app-inner-max-width);
    max-height: var(--app-inner-max-height);
	opacity: 0;
	overscroll-behavior: contain;
	translate: 0 24px;

	@include media('>=md') {
		left: initial;
    	width: 50%;
	}

	@media (prefers-reduced-motion: no-preference) {
		transition: opacity 0.4s ease(out-quad), translate 0.4s ease(out-quad);
	}

	&--visible {
		opacity: 1;
		translate: 0 0;
	}
}

.title {
    font-size: 18px;
    margin-block: initial;
    padding-block: 8px;
    padding-inline: var(--v-project-page-padding-inline);
}

.content-wrapper {
	opacity: 0;

	&--from-prev {
		translate: -40px 0;
	}

	&--from-next {
		translate: 40px 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		transition: opacity 0.4s ease(out-quad), translate 0.4s ease(out-quad);
	}

	&--visible {
		opacity: 1;
		translate: 0 0;
	}
}

.back {
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    font-size: 22px;
    padding-inline: var(--v-project-page-padding-inline);
}

.content {
    padding: var(--v-project-page-padding-inline);
    background-color: var(--color-background);
}

.attributes {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
    padding-block: 8px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    gap: inherit;
    list-style: none;
}

.short-description {
    margin-top: 16px;
}

.description {
    margin-top: 16px;
}

.media {
    margin-block: 0;
}

.not-found {
    padding: var(--v-project-page-padding-inline);
}

.button {
    padding: 12px 24px;
    border: none;
    border-radius: 9px;
    background-color: var(--color-surface);
    color: var(--color-content);
    cursor: pointer;

    @supports (corner-shape: squircle) {
        border-radius: 24px;
        corner-shape: squircle;
    }
}
</style>
