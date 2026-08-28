<script setup lang="ts">
import type { NuxtError } from 'nuxt/app'

const { error } = defineProps<{
	error: NuxtError
}>()

const { t } = useI18n()

const isServerError = computed(() => String(error.statusCode)?.startsWith('5')) // 50x errors
const title = computed(() => {
	if (error.statusCode === 404) {
		return t('error_page.not_found_title')
	}

	if (error.statusCode === 401) return t('error_page.unauthenticated_user_error_title')

	if (error.statusCode === 403) return t('error_page.unauthorized_access_error_title')

	if (isServerError.value) return t('error_page.server_error_title')

	return t('error_page.fallback_title')
})

const subtitle = computed(() => t('error_status', { code: error.statusCode }))
const content = computed(() => {
	if (error.statusCode === 404) return t('error_page.not_found_content')
	else if (isServerError.value) return t('error_page.server_error_content')

	return t('error_page.content')
})

const errorMessage = computed(() => import.meta.dev ? error.message : undefined)

useHead({
	title: title.value,
})

function goToHome() {
	clearError({ redirect: '/' })
}

function reload() {
	window.location.reload()
}
</script>

<template>
    <VPageWrapper>
        <VErrorContent
            :title="title"
            :subtitle="subtitle"
            :content="content"
            :error-message="errorMessage"
        >
            <button
                v-if="isServerError"
                :class="$style.button"
                @click="reload"
            >
                {{ $t('refresh') }}
            </button>
            <button
                v-else
                :class="$style.button"
                @click="goToHome"
            >
                {{ $t('back_home') }}
            </button>
        </VErrorContent>
        <VMainNav />
    </VPageWrapper>
</template>

<style lang="scss" module>
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
