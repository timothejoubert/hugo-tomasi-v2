<script lang="ts" setup>
defineProps<{
    content: string
}>()

const { copy, copied } = useClipboard()
const isCtaHovered = ref(false)

</script>
<template>
    <button
        v-if="content"
        :class="$style.root"
        @click="copy(content)"
        @mouseenter="isCtaHovered = true"
        @mouseleave="isCtaHovered = false"
        class="text-h4"
    >
        <VAnimatedText
            :content="content"
            :revealed="isCtaHovered"
            :duration="200"
            :stagger="10"
            swap
        />
        <Transition name="indicator">
            <span
                v-if="copied"
                aria-live="assertive"
                :class="$style['indicator']"
                class="text-body-xs"
            >{{ $t('copied') }}</span>
        </Transition>
    </button>
</template>
<style lang="scss" module>

.root {
    position: relative;
    border: initial;
    background: initial;
    color: var(--color-content);
    cursor: pointer;
}

.indicator {
    position: absolute;
    right: -8px;
    padding: 6px;
    border-radius: 4px;

    // background-color: color-mix(in srgb, var(--color-content) 10%, transparent);
    background-color: var(--color-accent);
    color: var(--color-content);
    translate: 100% 0;
}
</style>
<style lang="scss">
.indicator-enter-active,
.indicator-leave-active {
    transition: opacity 0.22s ease(out-quad), translate 0.22s ease(out-quad);
}

.indicator-enter-from,
.indicator-leave-to {
    opacity: 0;
    translate: 100% 8px;
}
</style>
