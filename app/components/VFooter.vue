<script setup lang="ts">
import { isFilled } from '@prismicio/client'

// Static text-only mapping so @nuxt/icon's usage scanner can bundle every icon literally
// (see VIcon.vue) — tiktok/vimeo fall back to a generic link glyph since neither installed
// icon set (material-symbols, uil) ships a dedicated icon for them.
const SOCIAL_ICONS: Record<string, string> = {
    facebook: 'uil:facebook',
    instagram: 'uil:instagram',
    twitter: 'uil:twitter',
    linkedin: 'uil:linkedin',
    youtube: 'uil:youtube',
    behance: 'uil:behance',
    tiktok: 'material-symbols:link',
    vimeo: 'material-symbols:link',
}

const { data: setting } = await usePrismicSettingsDocument()
const runtimeConfig = useRuntimeConfig()

const socials = computed(() => {
    return (setting.value?.data?.publisher_socials || []).filter(social => social.type && isFilled.link(social.link))
})

const siteName = computed(() => runtimeConfig.public.site.name)
</script>

<template>
    <footer :class="$style.root">
        <div :class="$style.bar">
            <div :class="$style.infos">
                <span>©{{ siteName }} {{ new Date().getFullYear() }}</span>
                <span :class="$style.separator">|</span>
                <span :class="$style.credit">{{ $t('footer.credit') }}</span>
            </div>
            <ul
                v-if="socials.length"
                :class="$style.socials"
                :aria-label="$t('footer.socials.aria_label')"
            >
                <li
                    v-for="social in socials"
                    :key="social.name"
                >
                    <VPrismicLink :to="social.link">
                        <VButton
                            v-if="social.type && SOCIAL_ICONS[social.type]"
                            tag="span"
                            design="filled"
                            size="s"
                            :icon-name="SOCIAL_ICONS[social.type]"
                            :class="$style.social"
                        />
                        <span class="visually-hidden">{{ social.name || social.type }}</span>
                    </VPrismicLink>
                </li>
            </ul>
        </div>
    </footer>
</template>

<style lang="scss" module>
.root {
    padding: 24px;
}

.bar {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 19px 32px 24px;
    border-radius: 16px;
    background-color: #181717;
    color: #fff;
    gap: 24px;
}

.infos {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    font-size: 14px;
    gap: 11px;
}

.separator {
    opacity: 0.5;
}

.credit {
    opacity: 0.7;
}

.socials {
    display: flex;
    align-items: center;
    margin: 0;
    gap: 10px;
    list-style: none;

    a {
        display: flex;
        color: inherit;
        text-decoration: none;
    }
}

.social {
    --v-button-padding-inline: 8px;
}
</style>
