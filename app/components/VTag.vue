<script lang="ts" setup>
import type { VWrapperElement } from '~/components/VWrapper.vue'
import type { ThemeProps } from '~/types/theme'

const props = defineProps<{
    label: string | null
    wrapper?: VWrapperElement
    filled?: boolean
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
        ]"
    >
        {{ label }}
    </VWrapper>
</template>

<style lang="scss" module>
.root {
    font-size: 12px;
    font-weight: 400;

    @include theme-variants;

    &--filled {
        min-height: 20px;
        padding-bottom: 2px;
        border-radius: 50vmax;
        background-color: var(--color-background);
        color: var(--color-content);
        padding-inline: 8px;
    }
}
</style>
