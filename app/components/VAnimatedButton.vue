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
    >
        <VAnimatedText
            :content="label"
            :revealed="isCtaHovered"
            :duration="300"
            :stagger="10"
        />
        <VButton
            v-if="icon"
            design="filled"
            tag="span"
            :icon-name="icon"
            :class="$style.icon"
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
    font-size: 16px;
    gap: 16px;
}

.icon {
    --v-button-display: flex;
    --v-button-padding-inline: 6px;
    --v-button-padding-block: 6px;

    aspect-ratio: 1;
    font-size: 19px;
}
</style>
