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
        class="slice-container-xl"
    >
        <div
            v-if="title"
            :class="$style.title"
            class="text-body-s"
        >
            {{ title }}
        </div>
        <VSkill
            v-for="(skill, i) in skillList"
            :key="i + ' ' + skill.title"
            v-bind="skill"
            :class="$style.skill"
        />
    </section>
</template>

<style lang="scss" module>
.root {
  position: relative;
}

.title {
  margin-bottom: 50px;
  opacity: 0.6;
  text-transform: uppercase;
}

.skill {
  margin-bottom: 42px;

  @include media('>=md') {
    margin-bottom: 30px;
  }
}
</style>
