<script lang="ts" setup>
const props = defineProps<{
    tags: string[]
    modelValue: string | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string | null]
}>()

function onChange(value: string | null) {
    emit('update:modelValue', value)
}
</script>

<template>
    <fieldset :class="$style.root">
        <legend class="visually-hidden">
            {{ $t('project_listing.filter_legend') }}
        </legend>
        <span :class="$style.option">
            <input
                id="project_filter_all"
                type="radio"
                name="project_filter"
                :class="$style.input"
                :checked="modelValue === null"
                @change="onChange(null)"
            >
            <VTag
                wrapper="label"
                for="project_filter_all"
                :label="$t('project_listing.filter_all_label')"
                :filled="modelValue === null"
                :outline="modelValue !== null"
                :theme="modelValue === null ? 'dark' : undefined"
                :class="$style.tag"
            />
        </span>
        <span
            v-for="(tag, index) in props.tags"
            :key="tag"
            :class="$style.option"
        >
            <input
                :id="`project_filter_${index}`"
                type="radio"
                name="project_filter"
                :class="$style.input"
                :checked="modelValue === tag"
                @change="onChange(tag)"
            >
            <VTag
                wrapper="label"
                :for="`project_filter_${index}`"
                :label="tag"
                :filled="modelValue === tag"
                :outline="modelValue !== tag"
                :theme="modelValue === tag ? 'dark' : undefined"
                :class="$style.tag"
            />
        </span>
    </fieldset>
</template>

<style lang="scss" module>
.root {
    display: flex;
    flex-wrap: wrap;
    padding: initial;
    border: none;
    margin: initial;
    gap: 8px;
}

.option {
    display: inline-flex;
}

.input {
    position: absolute;
    overflow: hidden;
    width: 1px;
    height: 1px;
    padding: 0;
    border: 0;
    margin: -1px;
    clip-path: inset(50%);
    white-space: nowrap;
}

.tag {
    cursor: pointer;

    @media (prefers-reduced-motion: no-preference) {
        transition: 0.2s ease(out-quad);
        transition-property: background-color, color, border-color;
    }

    .input:focus-visible + & {
        outline: 2px solid var(--color-content);
        outline-offset: 2px;
    }
}
</style>
