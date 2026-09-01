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
    <VSlice
        :slice="slice"
        :title="title"
        spacing="xxl"
    >
        <VSkill
            v-for="(skill, i) in skillList"
            :key="i + ' ' + skill.title"
            v-bind="skill"
        />
    </VSlice>
</template>
