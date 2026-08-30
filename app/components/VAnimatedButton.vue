<script lang="ts" setup>
defineProps<{
    label: string
    icon?: string
}>()

const isCtaHovered = ref(false)
</script>

<template>
    <button
        :class="$style.root"
        @mouseenter="isCtaHovered = true"
        @mouseleave="isCtaHovered = false"
        @focus="isCtaHovered = true"
        @blur="isCtaHovered = false"
    >
        <div :class="$style['video-cta__label']">
            <VSplitText
                class="text-body-xs"
                render="chars"
                :play-animation="isCtaHovered"
                :content="label"
            />
        </div>
        <VButton
            v-if="icon"
            design="filled"
            tag="span"
            :icon-name="icon"
            :class="$style['icon']"
            @mouseenter="isCtaHovered = true"
            @mouseleave="isCtaHovered = false"
        />
    </button>
</template>

<style lang="scss" module>
.root {
    display: inline-flex;
    align-items: center;
    padding: 0;
    border: none;
    background-color: initial;
    color: var(--color-content);
    cursor: pointer;
    gap: 16px;
}

.icon {
    --v-button-display: flex;
    --v-button-padding-inline: 6px;
    --v-button-padding-block: 6px;

    aspect-ratio: 1;
    font-size: 16px;
}
</style>
