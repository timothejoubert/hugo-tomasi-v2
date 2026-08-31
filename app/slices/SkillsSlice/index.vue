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
        class="slice-container--xxl"
    >
        <h2
            v-if="title"
            :class="$style.title"
            class="text-overtitle"
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
.title {
    margin-bottom: 42px;
    opacity: 0.6;
}
</style>
