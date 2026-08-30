<script lang="ts" setup>
const expanded = ref(false)
const toggle = () => expanded.value = !expanded.value
const id = 'setting-modal-' + useId()

const buttonEl = useTemplateRef<HTMLButtonElement>('buttonEl')

function close() {
    if (!expanded.value) return
    expanded.value = false
    buttonEl.value?.focus()
}

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && expanded.value) {
        e.stopPropagation()
        close()
    }
}

const { activate: onButtonMagnetEvent } = useMagnetHover()
</script>

<template>
    <div
        :class="$style.root"
        @pointerenter="onButtonMagnetEvent"
        @pointerleave="onButtonMagnetEvent"
        @keydown="onKeydown"
    >
        <slot name="target">
            <button
                ref="buttonEl"
                :class="$style.button"
                :aria-controls="id"
                :aria-expanded="expanded"
                :aria-label="$t('show_setting.button_label')"
                @click="toggle"
            >
                <VIcon
                    name="material-symbols:settings"
                    size="1.3em"
                />
            </button>
        </slot>
        <div
            :id="id"
            role="group"
            :inert="!expanded"
            :class="[$style.content, expanded && $style['content--visible']]"
            :aria-label="$t('show_setting.aria_label')"
        >
            <div :class="$style.inner">
                <VThemeSwitcher />
                <VColumnsInput />
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::before {
        position: absolute;
        z-index: -1;
        content: '';
        inset: -12px;
    }
}

.button {
    position: relative;
    display: flex;
    overflow: hidden;
    height: 100%;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 9px;
    background-color: var(--color-surface);
    color: var(--color-content);
    cursor: pointer;
    isolation: isolate;
    padding-inline: 16px;

    &::after {
        position: absolute;
        z-index: -1;
        background-color: var(--color-background);
        content: '';
        inset: 5px;
        opacity: 0;
        scale: 0.85;
        translate: var(--magnet-x, 0) var(--magnet-y, 0);

        @media (prefers-reduced-motion: no-preference) {
            transition: opacity 0.3s ease(out-quart), scale 0.3s ease(out-quart), translate 0.3s ease(out-quart);
        }

        .root:hover & {
            opacity: 1;
            scale: 1;
            translate: 0 0;
        }

        @supports (corner-shape: squircle) {
            border-radius: 42px;
            corner-shape: squircle;
        }
    }

    &[aria-expanded="true"]::after {
        opacity: 1;
        scale: 1;
        translate: 0 0;
    }

    @supports (corner-shape: squircle) {
        border-radius: 24px;
        corner-shape: squircle;
    }
}

.content {
    position: absolute;
    z-index: -1;
    top: 0;
    width: fit-content;
    min-width: var(--setting-modal-min-width, fit-content);
    max-width: 100%;
    border-radius: 9px;
    background-color: var(--color-surface);
    color: var(--color-content);
    opacity: 0;
    pointer-events: none;
    transition: opacity .22s ease(out-quad), translate .22s ease(out-quad);
    translate: 0 -80%;

    @supports (corner-shape: squircle) {
        border-radius: 24px;
        corner-shape: squircle;
    }

    &--visible {
        opacity: 1;
        pointer-events: initial;
        translate: 0 calc(-100% - 12px);
    }
}

.inner {
    padding: 6px;
}
</style>
