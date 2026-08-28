<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.PromoteSliceSlice>())

const title = computed(() => props.slice.primary.title)

const promoteList = computed(() => {
	return props.slice.items
})
</script>

<template>
    <section
        :class="$style.root"
        class="slice-container-xl"
    >
        <div
            v-if="title"
            class="text-over-title-m"
            :class="$style.title"
        >
            {{ title }}
        </div>

        <template v-if="promoteList?.length">
            <VLink
                v-for="(promote, i) in promoteList"
                :key="`${i}-${promote.title}`"
                :class="$style.wrapper"
                :reference="promote.link"
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
                <VButton
                    :class="$style.cta"
                    :label="promote.link_label || $t('button.default_label')"
                    icon-name="arrow-up-right"
                />
            </VLink>
        </template>
    </section>
</template>

<style lang="scss" module>
.root {
}

.title {
  margin-bottom: 32px;
  text-transform: uppercase;
}

.wrapper {
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
    .wrapper:hover & {
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

.cta {
  --v-button-padding-inline: 0;
  --v-button-icon-margin: #{0px 0px 0px 4px};
}
</style>
