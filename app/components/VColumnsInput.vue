<script lang="ts" setup>
const { columns, min, max } = useGridColumns()

if (import.meta.server) {
	useHead({
		style: [{ innerHTML: `:root{ --v-home-grid-columns: ${columns.value}; }` }],
	})
}

function setGridColumnsCssVar() {
	document.documentElement.style.setProperty('--v-home-grid-columns', String(columns.value))
}

watch(columns, setGridColumnsCssVar)

function onGridColumnsInput(e: Event) {
	const value = Number((e.target as HTMLInputElement).value)
	if (value) columns.value = value
}
</script>

<template>
    <div :class="$style.root">
        <label for="grid_value">{{ $t('show_setting.grid_value_label') }}</label>
        <input
            id="grid_value"
            type="number"
            :min="min"
            :max="max"
            :value="columns"
            aria-describedby="grid_value_hint"
            @change="onGridColumnsInput"
        >
        <span
            id="grid_value_hint"
            class="visually-hidden"
        >
            {{ $t('show_setting.grid_value_hint', { min, max }) }}
        </span>
    </div>
</template>

<style lang="scss" module>
.root {
	display: flex;
	justify-content: space-between;
	margin-top: 10px;
}
</style>
