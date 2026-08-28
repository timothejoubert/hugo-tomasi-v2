<script lang="ts">
export interface SortState {
	field: string
	direction: 'asc' | 'desc'
}
</script>

<script lang="ts" setup>
const props = defineProps<{
	label: string
	field: string
}>()

const model = defineModel<SortState>({ required: true })

const isActive = computed(() => model.value.field === props.field)

const nextDirection = computed(() => {
	return isActive.value && model.value.direction === 'asc' ? 'desc' : 'asc'
})
const sortState = computed(() => {
	if (!isActive.value) return 'none'
	return model.value.direction === 'asc' ? 'ascending' : 'descending'
})

function onClick() {
	model.value = { field: props.field, direction: nextDirection.value }
}
</script>

<template>
    <button
        type="button"
        :class="[$style.link, isActive && $style['link--active']]"
        :title="sortState === 'ascending' ? $t('sort_descending', { label: props.label }) : $t('sort_ascending', { label: props.label })"
        @click="onClick"
    >
        {{ props.label }}
        <VIcon
			v-if="isActive"
			:class="$style.icon"
            :name="nextDirection === 'asc' ? 'material-symbols:arrow-downward-alt' : 'material-symbols:arrow-upward-alt'"
        />
		<span v-else
			:class="$style.circle"
		></span>
    </button>
</template>

<style lang="scss" module>
.link {
	display: inline-flex;
	align-items: center;
	padding: 0;
	border: none;
	background: none;
	color: inherit;
	cursor: pointer;
	font: inherit;
	gap: 4px;
	text-decoration: none;

	&--active {
		font-weight: 800;
	}
}

.circle {
	display: inline-block;
	width: 4px;
	height: 4px;
	border-radius: 50vmax;
	margin-top: 2px;
	margin-left: 3px;
	background-color: currentcolor;
}

.icon {
	margin-top: 2px;

	.link--active & {
		color: var(--color-accent);
	}
}
</style>
