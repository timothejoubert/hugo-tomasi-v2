<script lang="ts" setup>
const { t } = useI18n()

const themeInputs = Object.keys(getThemes()).map((theme) => {
	const label = t('theme_switcher.' + theme)
	return {
		name: 'color-theme',
		id: 'theme-' + theme,
		value: theme,
		label,
		data: getTheme(theme),
	}
})

const currentTheme = useCookie('user-color-theme', {
	default: () => themeInputs[0]?.value || 'main',
	watch: true,
})

const currentThemeData = computed(() => themeInputs.find(theme => theme.value === currentTheme.value)?.data)

function onChange(e: Event) {
	const value = (e.target as { value?: string | undefined })?.value

	if (value) currentTheme.value = value
}

// META
const metaScript = computed(() => [{ name: 'theme-color', content: currentThemeData.value?.['color-background'] }])
const styleTag = computed(() => {
	if (!currentThemeData.value) return []

	const style = Object.entries(currentThemeData.value).reduce((acc, [key, value]) => {
		acc += '--' + key + ': ' + value + '; '

		return acc
	}, '')
	return [{ innerHTML: `:root{ ${style} }` }]
})

useHead({
	meta: metaScript,
	style: styleTag,
})
</script>

<template>
    <fieldset :class="$style.fieldset">
        <legend class="visually-hidden">
            {{ $t('theme_switcher.legend') }}
        </legend>
        <div
            v-for="themeInput in themeInputs"
            :key="themeInput.id"
            :class="$style.item"
        >
            <label
                :for="themeInput.id"
                :class="$style.label"
            >
                <span :class="$style.label__text">
                    {{ themeInput.label }}
                </span>
                <div :class="$style['color-items']">
                    <template
                        v-for="(colorValue, colorName) in themeInput.data"
                        :key="colorName"
                    >
                        <span
                            :style="{ backgroundColor: colorValue }"
                            :class="$style['color-item']"
                        />
                    </template>
                </div>
            </label>
            <input
                :id="themeInput.id"
                type="radio"
                :name="themeInput.name"
                :value="themeInput.value"
                :checked="themeInput.value === currentTheme"
                class="visually-hidden"
                @change="onChange"
            >
        </div>
    </fieldset>
</template>

<style lang="scss" module>
.fieldset {
	all: unset;
	display: flex;
	flex-flow: column wrap;
	justify-content: space-between;
	gap: 4px;
}

.label {
	display: flex;
	width: 100%;
	align-items: center;
    justify-content: space-between;
	padding: 8px;
	border-radius: 8px;
	cursor: pointer;
	gap: 24px;
	transition: background-color 0.3s ease(out-quad);

	.item:has(input:checked) & {
		background-color: var(--color-background);
	}

	.item:not(:has(input:checked)):hover & {
		background-color: color-mix(in srgb, var(--color-background) 40%, transparent);
	}
}

.label__text {
	white-space: nowrap;
}

.color-items {
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.color-item {
	position: relative;
	display: inline-block;
	width: 20px;
	border-radius: 50vmax;
	aspect-ratio: 1;

	&:not(:last-child) {
		margin-right: -9px;
	}
}
</style>
