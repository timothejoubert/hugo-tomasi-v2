<script lang="ts" setup>
import { defaultPageTransition } from '~/transitions/default-page-transition'
import type { HomePageDocument } from '~/prismicio-types'
import { DocumentType } from '~/constants/document-type'

definePageMeta({
  pageTransition: defaultPageTransition,
  name: DocumentType.HOME,
  alias: ['/en-gb'],
})

const { webResponse, pageData, alternateLinks, error } = await useFetchPage<HomePageDocument>(DocumentType.HOME)

if (error) {
  showError(error)
}

usePage({
  webResponse,
  alternateLinks,
  title: webResponse.data.meta_title || webResponse.data.title || webResponse.uid || '',
})
</script>

<template>
  <div :class="$style.root">
    <VHeaderHome :page-data="pageData" />
    <pre>{{ pageData }}</pre>
  </div>
</template>

<style lang="scss" module>
.root {
}
</style>
