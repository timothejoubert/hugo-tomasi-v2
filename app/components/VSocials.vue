<script lang="ts" setup>
import { getSocial } from '~/utils/social-link'
import type { SettingDocumentData } from '~~/prismicio-types'
import { isFilled } from '@prismicio/client'

const props = defineProps<{
    field: SettingDocumentData['publisher_socials']
    output?: 'button' | 'link'
}>()

const _output = computed(() => props.output || 'button')

const socials = computed(() => {
    return props.field.map(item => {
        const link = isFilled.link(item?.link) ? item.link : null

        if(!link?.url) return null

        return {
            ...getSocial(link.url),
            name: link?.text || getSocial(link.url).name,
        }
    }).filter(social => social?.url)
})
</script>
<template>
    <ul
        v-if="socials?.length"
        :class="[$style.root, $style[`root--${_output}`]]"
        :aria-label="$t('footer.socials.aria_label')"
    >
        <li
            v-for="social in socials"
            :key="social?.url"
        >
            <VPrismicLink
                v-if="social?.url"
                :to="social.url"
                :class="$style.link"
                :aria-label="$t('socials.link_aria_label', { name: social.name || 'social' })"
            >
                <slot :social="social">
                    <VButton
                        v-if="social.icon && _output === 'button'"
                        tag="span"
                        design="filled"
                        size="sm"
                        :icon-name="social.icon"
                        theme="light"
                        :class="$style.social"
                    />
                    <template
                        v-else
                    >
                        <span :class="$style.label">{{ social.name }}</span>
                        <VIcon
                            name="i-material-symbols:arrow-outward"
                            :class="$style.icon"
                        />
                    </template>
                </slot>
            </VPrismicLink>
        </li>
    </ul>
</template>
<style lang="scss" module>
.root {
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    gap: var(--v-socials-gap, 10px);
    list-style: none;
}

.link {
    display: inline-flex;
    color: inherit;
    text-decoration: none;

    .root--link & {
        align-items: center;
        gap: 5px;
    }
}
</style>
