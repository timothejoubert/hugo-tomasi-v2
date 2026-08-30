<script setup lang="ts">
import type { Content } from '@prismicio/client'

const props = defineProps(getSliceComponentProps<Content.SkillsSliceSlice>())

const title = computed(() => props.slice.primary.title)
const skillList = computed(() => {
    return props.slice.items.map((item) => {
        return {
            title: item.title,
            content: item.content,
            sideTitle: item.side_title,
            sideContent: item.side_content,
        }
    })
})
</script>

<template>
    <section
        :class="$style.root"
        class="slice-container--xl"
    >
        <h2
            v-if="title"
            :class="$style.title"
            class="text-body-s"
        >
            {{ title }}
        </h2>
        <VSkill
            v-for="(skill, i) in skillList"
            :key="i + ' ' + skill.title"
            v-bind="skill"
        />
    </section>
</template>

<style lang="scss" module>
// Figma shows this slice on a light/inverted section (dark theme elsewhere on the page) —
// flip the two theme tokens locally rather than adding a whole second global theme entry.
.root {
    position: relative;
    background-color: var(--color-background);
    color: var(--color-content);
}

.title {
    margin-bottom: 50px;
    opacity: 0.6;
    text-transform: uppercase;
}
</style>
