<script setup lang="ts">
import type { ProjectPageDocument } from '~/prismicio-types'
import { defaultPageTransition } from '~/transitions/default-page-transition'
import { DocumentType } from '~/constants/document-type'
import { getProjectTags } from '~/utils/prismic/project'

definePageMeta({
  pageTransition: defaultPageTransition,
  name: DocumentType.PROJECT,
  alias: ['/en-gb/projets/:uid'],
})

const {
  webResponse,
  pageData: project,
  alternateLinks,
  error,
} = await useFetchPage<ProjectPageDocument>(DocumentType.PROJECT)

if (error) {
  showError(error)
}

usePage({
  webResponse,
  alternateLinks,
  title: webResponse.data.meta_title || webResponse.data.title || webResponse.uid || '',
})

const mediaSrc = computed(() => {
  const src = project.embed_url?.url || project.thumbnail?.url || project.main_media?.url || ''
  return src.substring(0, src.lastIndexOf('?'))
})

const tags = computed(() => getProjectTags(webResponse))

function getProjectListingUrlByTag(tag: string) {
  return `/projets?tag=${tag}`
}

// TODO: add parallax effect on img
</script>

<template>
  <div :class="$style.root" class="container-fullscreen">
    <div :class="$style.head">
      <h1 v-if="project.title" class="text-h2" :class="$style.title">{{ project.title }}</h1>
      <VText v-if="project.excerpt" :content="project.excerpt" :class="$style.description" class="text-body-s" />
      <div v-if="tags.length" :class="$style.tags">
        <VButton
          v-for="(tag, i) in tags"
          :key="tag + '-' + i"
          :to="getProjectListingUrlByTag(tag)"
          :label="tag"
          outlined
          theme="light"
          size="m"
        />
      </div>
    </div>
    <div :class="$style['media-wrapper']">
      <NuxtImg
        v-if="mediaSrc"
        :src="mediaSrc"
        provider="imgix"
        fit="crop"
        width="1232"
        height="740"
        :class="$style.image"
        :modifiers="{ crop: 'edges' }"
        sizes="xs:100vw sm:100vw md:100vw lg:100vw vl:100vw xl:100vw xxl:100vw hd:100vw qhd:100vw"
      />
    </div>
    <VText
      v-if="project.description"
      :content="project.description"
      :class="$style['description-full']"
      class="text-body-s"
    />
  </div>
</template>

<style lang="scss" module>
.root {
  position: relative;
  overflow: auto;
  padding-bottom: rem(102);
  margin-top: calc(var(--v-top-bar-height) * -1);
  background-color: color(black);
  color: color(white);
  padding-inline: var(--page-gutter);
}

.head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: rem(12);
  margin-top: calc(var(--v-top-bar-height) + #{rem(100)});
  margin-bottom: rem(22);
}

.title {
  margin-right: rem(30);
}

.description {
  flex-basis: clamp(#{rem(330), 40%, rem(500)});
  margin-top: rem(5);
  opacity: 0.7;
}

.tags {
  display: flex;
  flex-basis: 100%;
  gap: rem(14);
}

.media-wrapper {
  display: flex;
  align-items: center;
  overflow: hidden;
  max-height: 70vh;
  border-radius: rem(30);
}
.image {
  position: relative;
  width: 100%;
}

.description-full {
  display: inline-block;
  width: clamp(#{rem(300), 50%, rem(600)});
  padding-top: rem(22);
  border-top: 1px solid rgba(color(white), 0.6);
  margin-top: rem(45);
  opacity: 0.7;
}
</style>
