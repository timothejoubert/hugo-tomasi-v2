<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.PromoteSliceSlice>())

const title = computed(() => props.slice.primary.title)
const promoteList = computed(() => props.slice.items)

const showContent = ref(false)
</script>

<template>
    <VSlice
        :slice="slice"
        :class="$style.root"
        spacing="xl"
        :title="title"
    >
        <ul
            v-if="promoteList?.length"
            :class="$style.list"
        >
            <li
                v-for="(promote, i) in promoteList"
                :key="`${i}-${promote.title}`"
                :class="$style.item"
            >
                <div
                    :class="$style.inner"
                    @mouseenter="showContent = true"
                    @mouseleave="showContent = false"
                >
                    <h3
                        v-if="promote.title"
                        :class="$style['promote-title']"
                        class="text-body"
                    >
                        {{ promote.title }}
                    </h3>
                    <div
                        v-if="promote.place"
                        :class="$style.place"
                        class="text-body-xs"
                    >
                        {{ promote.place }}
                    </div>
                    <div
                        v-if="promote.year"
                        :class="$style.year"
                        class="text-body-xs"
                    >
                        {{ promote.year }}
                    </div>
                    <VPrismicLink
                        v-slot="scopedProps"
                        :to="promote.link"
                        custom
                    >
                        <VButton
                            v-bind="scopedProps"
                            :class="$style.button"
                            size="sm"
                            :label="promote.link_label || $t('button.default_label')"
                            icon-name="material-symbols:arrow-outward"
                        />
                    </VPrismicLink>
                </div>
                <VTransitionExpand
                    v-if="promote.content"
                >
                    <div
                        v-show="showContent"
                        :class="$style.content"
                        class="text-body-xs"
                    >
                        {{ promote.content }}
                    </div>
                </VTransitionExpand>
            </li>
        </ul>
    </VSlice>
</template>

<style lang="scss" module>
.root {
    position: relative;
}

.list {
    padding: 0;
    margin: 0;
    list-style: none;
}

.item {
    --v-promote-border: 1px solid color-mix(in srgb, var(--color-content) 10%, transparent);

    position: relative;
    border-top: var(--v-promote-border);

    &:last-child {
        border-bottom: var(--v-promote-border);
    }

    &::before {
        position: absolute;
        content: '';
        inset: 0 calc(var(--grid-margin) * -1);
        transition: background-color 0.3s ease(out-quad);
    }

    @media (hover: hover) {
        &:hover::before {
            background-color: color-mix(in srgb, var(--color-content) 4%, transparent);
        }
    }

    @include media('>=md') {
        gap: 16px;
    }
}

.inner {
    display: grid;
    align-items: center;
    gap: 8px;
    grid-auto-flow: dense;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding-block: 12px;
}

.promote-title {
    min-width: 8ch;
    margin: 0;
    font-weight: 700;
    transition: transform 0.3s ease(out-quad);

    @media (hover: hover) {
        .item:hover & {
            transform: translateX(10px);
        }
    }
}

.content {
    overflow: hidden;
    flex-grow: 1;
    font-weight: 300;
    grid-column: 1 / -1;
    opacity: 0.8;
    text-overflow: ellipsis;
}

.year,
.place {
    opacity: 0.8;
    white-space: nowrap;
}

.button {
    justify-content: flex-end;

    // @at-root a.button::before {
    //     position: absolute;
    //     content: '';
    //     inset: 0;
    // }
}
</style>
