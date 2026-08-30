<script setup lang="ts">
import type { RichTextField } from '@prismicio/client'

export interface VSkillProps {
    title: string | null
    content: string | RichTextField
    sideTitle: string | null
    sideContent: string | RichTextField
}

defineProps<VSkillProps>()
const isOpened = ref(false)
const isHoveringHead = ref(false)

const id = `collapsable-${useId()}`
</script>

<template>
    <section :class="$style.root">
        <div
            :class="$style.head"
            @click="isOpened = !isOpened"
            @mouseleave="isHoveringHead = false"
            @mouseenter="isHoveringHead = true"
        >
            <VButton
                design="filled"
                :class="$style.button"
                :play-animation="isHoveringHead"
                :aria-controls="id"
                :aria-expanded="isOpened"
                :aria-label="isOpened ? $t('collapse.section', { name: title }) : $t('extend.section', { name: title })"
            >
                <template #icon="{ iconClass }">
                    <div :class="[$style.icon, iconClass]" />
                </template>
            </VButton>
            <h3
                v-if="title"
                :class="$style.title"
                class="text-h3"
            >
                <VSplitText
                    :content="title"
                    render="chars"
                />
            </h3>
        </div>
        <VTransitionExpand v-show="isOpened">
            <div
                :id="id"
                :class="$style.body"
            >
                <div
                    :class="$style['body-inner']"
                    class="inner-grid"
                >
                    <VText
                        :content="content"
                        :class="$style.content"
                        class="text-body-s"
                    />
                    <div
                        v-if="sideTitle"
                        :class="$style['side-title']"
                        class="text-over-title-s"
                    >
                        {{ sideTitle }}
                    </div>
                    <VText
                        v-if="sideContent"
                        :class="$style['side-content']"
                        class="text-body-s"
                        :content="sideContent"
                    />
                </div>
            </div>
        </VTransitionExpand>
    </section>
</template>

<style lang="scss" module>
.root {
    position: relative;
}

.head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border-top: 1px solid color-mix(in srgb, var(--color-content) 15%, transparent);
    cursor: pointer;
    gap: 10px var(--gutter);
    padding-block: 30px;

    @include media('>=md') {
        flex-wrap: nowrap;
    }
}

.button {
    min-width: flex-grid(1 ,12);
}

.icon {
    position: relative;
    display: flex;
    width: 1rem;
    height: 1rem;
    align-items: center;

    &::before,
    &::after {
        position: absolute;
        width: 100%;
        height: 2px;
        background-color: currentcolor;
        content: '';
        transform-origin: center;
        transition:
            background-color 0.3s,
            rotate 0.2s,
            opacity 0.2s;
    }

    button[aria-expanded="false"] &::after {
        rotate: 90deg;
    }

    button[aria-expanded="true"] &::after {
        opacity: 0;
    }
}

.title {
    margin-block: 0;
    text-transform: uppercase;
}

.body-inner {
    padding-bottom: 52px;
}

.content {
    grid-column: 1 / -1;
    margin-block: 0;

    @include media('>md') {
        grid-column: 2 / span 5;
        grid-row: 1 / 4;
    }
}

.side-title {
    grid-column: 1 / -1;

    @include media('>md') {
        grid-column: 8 / span 3;
    }
}

.side-content {
    grid-column: 1 / -1;
    line-height: 1.4;
    opacity: 0.7;

    @include media('>md') {
        grid-column: 8 / span 3;
    }
}
</style>
