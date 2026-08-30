<script lang="ts" setup>
import { asLinkAttrs, isFilled } from '@prismicio/client'
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'
import { getFormattedLocale } from '~/composables/use-prismic-locale'

const { data } = await usePrismicFetchDocument(prismicDocumentType.MENU)
const runtimeConfig = useRuntimeConfig()

const links = computed(() => data.value?.data.links || [])

const _links = computed(() => {
    return links.value.filter((item) => {
        return isFilled.link(item.link)
    }).map((item) => {
        return {
            ...asLinkAttrs?.(item.link) || {},
            label: item.label,
        }
    })
})

// Only offered once more than one locale is configured (see i18n/i18n.ts — today only `fr`)
// AND the document actually currently displayed has a published version in that locale —
// otherwise it would link to a page that doesn't exist yet.
const { locales, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const currentPage = useCurrentPage()

const hoveredHref = ref<string | null | undefined>(null)

const alternateLocales = computed(() => {
    if ((locales.value?.length || 0) < 2) return []

    const alternateLangs = currentPage.value.document?.alternate_languages || []
    return locales.value.filter((availableLocale) => {
        return availableLocale.code !== locale.value
            && alternateLangs.some(alt => getFormattedLocale(alt.lang) === getFormattedLocale(availableLocale.code))
    })
})
</script>

<template>
    <nav
        :aria-label="$t('main_nav.aria_label')"
        :class="$style.root"
        role="navigation"
    >
        <VPrismicLink
            :to="getRoutePath('home_page')"
            :class="$style.logo"
        >
            {{ runtimeConfig.public.site.name }}
        </VPrismicLink>
        <div :class="$style.end">
            <ul
                v-if="_links?.length"
                :class="$style.list"
            >
                <li
                    v-for="link in _links"
                    :key="link?.href"
                    :class="$style.item"
                >
                    <slot
                        :url="link.href"
                        :label="link.label"
                    >
                        <VPrismicLink
                            :to="link.href"
                            :class="$style.link"
                            :target="link.target"
                            :rel="link.rel"
                            @mouseenter="hoveredHref = link.href"
                            @mouseleave="hoveredHref = null"
                            @focus="hoveredHref = link.href"
                            @blur="hoveredHref = null"
                        >
                            <VAnimatedText
                                :content="link.label"
                                :revealed="hoveredHref === link.href"
                                swap
                            />
                        </VPrismicLink>
                    </slot>
                </li>
            </ul>
            <div
                v-if="alternateLocales.length"
                :class="$style['lang-switch']"
            >
                <span :class="$style['lang-switch__current']">
                    {{ getFormattedLocale(locale) }}
                    <VIcon name="material-symbols:keyboard-arrow-down" />
                </span>
                <ul :class="$style['lang-switch__list']">
                    <li
                        v-for="altLocale in alternateLocales"
                        :key="altLocale.code"
                    >
                        <NuxtLink :to="switchLocalePath(altLocale.code)">
                            {{ getFormattedLocale(altLocale.code) }}
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style lang="scss" module>
.root {
    position: sticky;
    z-index: 101;
    top: 0;
    display: flex;
    min-height: var(--v-main-nav-min-height);
    align-items: center;
    justify-content: space-between;
    filter: invert(1);
    gap: 24px;
    mix-blend-mode: difference;
    padding-inline: var(--grid-margin);

    // bluured background not working with mix-blend-mode: difference; or filter: invert(1); effect
    // &::before {
    //     position: absolute;
    //     display: block;
    //     backdrop-filter: blur(.0625rem);
    //     content: "";
    //     inset: 0;
    //     mask-image: radial-gradient(closest-side, #000 40%, #0000);
    //     pointer-events: none;
    // }
}

.logo {
    color: var(--color-content);
    text-decoration: none;
    text-transform: uppercase;
}

.end {
    display: flex;
    align-items: center;
    gap: 15px;
}

.list {
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    gap: 14px;
}

.lang-switch {
    position: relative;

    // color: var(--color-content);
    text-transform: uppercase;

    &__current {
        display: flex;
        align-items: center;
    }

    &__list {
        position: absolute;
        top: 100%;
        left: 0;
        display: none;
        padding: 0;
        margin: 0;
        list-style: none;

        a {
            color: inherit;
            text-decoration: none;
        }
    }

    &:hover &__list,
    &:focus-within &__list {
        display: block;
    }
}

.item {
    list-style: none;
}

.link {
    display: block;
    color: var(--color-content);
    text-decoration: none;
    text-transform: uppercase;
}
</style>
