<script lang="ts" setup>
import { asLinkAttrs, isFilled } from '@prismicio/client'
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { data } = await usePrismicFetchDocument(prismicDocumentType.MENU)

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
</script>

<template>
    <nav
        :aria-label="$t('main_nav.aria_label')"
        :class="$style.root"
        role="navigation"
    >
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
                    >
                        {{ link.label }}
                    </VPrismicLink>
                </slot>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" module>
.list {
    display: flex;
    width: fit-content;
    padding: 5px;
    border-radius: 9px;
    anchor-name: --hovered-link;
    background-color: var(--color-surface);
    isolation: isolate;
    margin-block: initial;

    @supports (corner-shape: squircle) {
        border-radius: 32px;
        corner-shape: squircle;
    }

    &:not(:has(li:hover)) li:has(a[aria-current="page"]) {
        anchor-name: --hovered-link;
    }

    li:hover {
        anchor-name: --hovered-link;
    }

    &::after {
        position: absolute;
        z-index: -1;
        border-radius: 10px;
        background: var(--color-background);
        content: "";
        inset: calc(anchor(bottom) - 6px) calc(anchor(right) + 14px) calc(anchor(bottom) + 3px) calc(anchor(left) + 14px);
        position-anchor: --hovered-link;

        @media (prefers-reduced-motion: no-preference) {
            transition: 0.3s ease(in-out-quad);
        }

        @supports (corner-shape: squircle) {
            border-radius: 24px;
            corner-shape: squircle;
        }
    }

    &:has(a:hover)::after {
        inset: anchor(top) anchor(right) anchor(bottom) anchor(left);

        @media (prefers-reduced-motion: no-preference) {
            transition: 0.25s ease(out-quart);
        }
    }
}

.item {
    list-style: none;
}

.link {
    display: block;
    padding: 7px 16px 8px;
    color: var(--color-content);
    text-decoration: none;
}
</style>
