<script setup lang="ts">
import type { ThemeProps } from '~/types/theme'
import { NuxtLink } from '#components'

interface VButtonProps {
    tag?: string
    label?: string
    iconName?: string
    design?: 'filled' | 'outlined'
    size?: 'xs' | 'sm' | 'md'
    theme?: ThemeProps['theme']
    url?: string
}

const props = defineProps<VButtonProps>()
const { themeClass } = useTheme({ props })

const internalTag = computed(() => {
    if(props.tag) {
        return props.tag
    }

    if(props.url) {
        return NuxtLink
    }

    return 'button'
})

const $style = useCssModule()
const rootClasses = computed(() => {
    return [
        $style.root,
        themeClass.value,
        $style[`root--${props.size || 'xs'}`],
        props.design && $style[`root--${props.design}`],
    ]
})
</script>

<template>
    <component
        :is="internalTag"
        :class="rootClasses"
        :url="url"
    >
        <span
            v-if="label"
            :class="$style.label"
        >
            {{ label }}
        </span>
        <slot
            name="icon"
            :icon-class="$style.icon"
        >
            <VIcon
                v-if="iconName"
                :name="iconName"
                :class="$style.icon"
            />
        </slot>
    </component>
</template>

<style lang="scss" module>
.root {
    @include theme-variants;

    display: var(--v-button-display, inline-flex);
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50vmax;
    background-color: transparent;
    color: var(--color-content, inherit);
    font-size: var(--v-button-font-size, 14px);
    gap: var(--v-button-gap, 6px);
    padding-block: var(--v-button-padding-block, 6px);
    padding-inline: var(--v-button-padding-inline, 12px);
    transition:
        background-color 0.3s ease(out-quad),
        color 0.3s ease(out-quad),
        border-color 0.3s ease(out-quad);

    @at-root {
        // remove the user agent style, but without specificity (i.e. :where()) for overriding it easily
        :where(a#{&}){
            text-decoration: initial;
        }

        // remove the user agent style, but without specificity (i.e. :where()) for overriding it easily
        :where(button#{&}),
        :where(a#{&}:link),
        :where(a#{&}:where(:visited)) {
            color: inherit;
        }

        // remove the user agent style, but without specificity (i.e. :where()) for overriding it easily
        :where(button#{&}){
            text-align: inherit;
        }
    }

    &:not(:where([inert], #{&}--disabled)) {
        cursor: var(--v-button-cursor, pointer);
    }

    &--outlined {
        border: 1px solid var(--color-content);

        @media (hover: hover) {
            &:not(:disabled, [inert]):hover {
                background-color: var(--color-content);
                color: var(--color-background);
            }
        }
    }

    &--filled {
        background-color: var(--color-content);
        color: var(--color-background);

        @media (hover: hover) {
            [button-wrapper="hover"]:hover &,
            &:not(:disabled, [inert]):hover {
                background-color: var(--color-surface);
            }
        }
    }

    &--sm {
        font-size: var(--v-button-font-size, 14px);
        gap: var(--v-button-gap, 10px);
        padding-block: var(--v-button-padding-block, 10px);
        padding-inline: var(--v-button-padding-inline, 20px);
    }

    &--md {
        font-size: var(--v-button-font-size, 16px);
        gap: var(--v-button-gap, 10px);
        padding-block: var(--v-button-padding-block, 12px);
        padding-inline: var(--v-button-padding-inline, 20px);
    }
}

.icon {
    flex-shrink: 0;
    margin: var(--v-button-icon-margin, 0);
    font-size: var(--v-button-icon-font-size, inherit);
}

.label {
    white-space: nowrap;
}
</style>
