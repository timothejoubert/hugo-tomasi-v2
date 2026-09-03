<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.PromoteSliceSlice>())

const title = computed(() => props.slice.primary.title)
const promoteList = computed(() => props.slice.items)
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
                    v-if="promote.title"
                    :class="$style['promote-title']"
                >
                    {{ promote.title }}
                </div>
                <div
                    v-if="promote.content"
                    :class="$style.content"
                >
                    {{ promote.content }}
                </div>
                <div
                    v-if="promote.place"
                    :class="$style.place"
                >
                    {{ promote.place }}
                </div>
                <div
                    v-if="promote.year"
                    :class="$style.year"
                >
                    {{ promote.year }}
                </div>
                <VPrismicLink
                    :to="promote.link"
                    v-slot="scopedProps"
                    custom
                >
                    <VButton
                        v-bind="scopedProps"
                        :class="$style.button"
                        :label="promote.link_label || $t('button.default_label')"
                        icon-name="material-symbols:arrow-outward"
                    />
                </VPrismicLink>
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
    --v-promote-border: 1px solid color-mix(in srgb, var(--color-content) 20%, transparent);

    position: relative;
    display: flex;
    min-height: 73px;
    align-items: center;
    border-top: var(--v-promote-border);
    gap: 16px;
    padding-block: 16px;

    &:last-child {
        border-bottom: var(--v-promote-border);
    }
}

.promote-title {
    min-width: 130px;
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
    opacity: 0.8;
    text-overflow: ellipsis;
}

.year,
.place {
    text-wrap: nowrap;

    &:not(:last-child)::after {
        position: relative;
        margin-left: 16px;
        content: '|';
    }
}

.button {
    @at-root a.button::before {
        position: absolute;
        content: '';
        inset: 0;
    }
}
</style>
