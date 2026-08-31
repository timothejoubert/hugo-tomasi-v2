<script lang="ts" setup>
import type { VWrapperElement } from '~/components/VWrapper.vue'
import type { ThemeProps } from '~/types/theme'

const props = defineProps<{
    label: string | null
    wrapper?: VWrapperElement
    filled?: boolean
    outline?: boolean
    theme?: ThemeProps['theme']
}>()

const { themeClass } = useTheme({ props })
</script>

<template>
    <VWrapper
        :wrapper="wrapper || 'span'"
        :class="[
            $style.root,
            themeClass,
            filled && $style['root--filled'],
            outline && $style['root--outline'],
        ]"
    >
        {{ label }}
    </VWrapper>
</template>

<style lang="scss" module>
.root {
    font-size: 13px;
    font-weight: 400;

    @include theme-variants;

    &--filled {
        min-height: 20px;
        border-radius: 50vmax;
        background-color: var(--color-background);
        color: var(--color-content);
        padding-block: 2px;
        padding-inline: 10px;
    }

    &--outline {
        min-height: 20px;
        border: 1px solid currentcolor;
        border-radius: 50vmax;
        padding-block: 2px;
        padding-inline: 10px;
    }
}
</style>
