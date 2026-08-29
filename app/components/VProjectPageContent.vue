<script lang="ts" setup>
import { isFilled } from '@prismicio/client'
import type { ProjectPageDocument } from '~~/prismicio-types'

const props = defineProps<{
	document?: ProjectPageDocument | null
}>()

const project = computed(() => props.document?.data)
const tags = computed(() => props.document?.tags?.filter(t => t) || [])
const hasHeroMedia = computed(() => isFilled.image(project.value?.main_media))
</script>

<template>
    <template v-if="document">
        <header
            :class="$style.header"
            class="grid-container"
        >
            <div :class="$style.top">
                <h1
                    v-if="project?.title"
                    class="text-h2"
                    :class="$style.title"
                >
                    {{ project.title }}
                </h1>
                <VText
                    v-if="project?.excerpt"
                    :content="project.excerpt"
                    class="text-body-s"
                    :class="$style.excerpt"
                />
            </div>
            <ul
                v-if="tags.length"
                :class="$style.tags"
            >
                <VTag
                    v-for="tag in tags"
                    :key="tag"
                    :label="tag"
                    wrapper="li"
                />
            </ul>
            <VPrismicImg
                v-if="hasHeroMedia"
                :field="project?.main_media"
                :width="1232"
                :height="490"
                sizes="xs:92vw sm:92vw md:92vw lg:85vw xl:85vw hq:85vw qhd:85vw"
                :modifiers="{ fit: 'crop' }"
                :class="$style.hero"
            />
        </header>
        <VText
            v-if="project?.content"
            :content="project.content"
            class="text-body-s slice-container"
            :class="$style.content"
        />
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
.header {
    background-color: var(--color-background);
    color: var(--color-content);
    padding-block: 24px 60px;
}

.top {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 24px;
}

.title {
    text-transform: uppercase;
}

.excerpt {
    max-width: 40ch;
    opacity: 0.8;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0 0 24px;
    gap: 10px;
    list-style: none;
}

.hero {
    width: 100%;
    border-radius: 30px;
}

.content {
    max-width: 70ch;
    margin-block: 60px;
}

.not-found {
    padding: var(--grid-margin);
}
</style>
