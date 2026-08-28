<script setup lang="ts">
interface VButtonProps {
	/** Rendering tag — defaults to `span` (not `button`) since every current call site nests
	 * VButton inside another interactive element (VLink, NuxtLink) that already provides the real
	 * click/keyboard semantics; pass `tag="button"` when using VButton standalone. */
	tag?: string
	label?: string
	/** Full `prefix:name` icon id, forwarded as-is to VIcon (see VIcon.vue for why it must be
	 * written literally at the call site rather than built dynamically here). */
	iconName?: string
	design?: 'filled' | 'outlined'
	size?: 's' | 'm'
	/** External hover/active trigger — lets a wrapping element larger than the button itself
	 * (e.g. VSkill's whole clickable head) drive the button's hover-style feedback. */
	playAnimation?: boolean
}

withDefaults(defineProps<VButtonProps>(), {
	tag: 'span',
	size: 'm',
})
</script>

<template>
    <component
        :is="tag"
        :class="[
            $style.root,
            $style[`root--${size}`],
            design && $style[`root--${design}`],
            playAnimation && $style['root--play-animation'],
        ]"
    >
        <slot
            name="icon"
            :icon-class="$style.icon"
        >
            <VIcon
                v-if="iconName"
                :name="iconName"
                :class="$style.icon"
            />
        </slot>
        <span
            v-if="label"
            :class="$style.label"
        >
            {{ label }}
        </span>
    </component>
</template>

<style lang="scss" module>
.root {
	display: inline-flex;
	min-width: var(--v-button-min-width, auto);
	align-items: center;
	justify-content: center;
	border: 1px solid transparent;
	border-radius: 999px;
	background-color: transparent;
	color: inherit;
	cursor: pointer;
	gap: 8px;
	padding-block: var(--v-button-padding-block, 10px);
	padding-inline: var(--v-button-padding-inline, 20px);
	transition:
		background-color 0.3s ease(out-quad),
		color 0.3s ease(out-quad),
		border-color 0.3s ease(out-quad);

	&--outlined {
		border-color: currentcolor;
	}

	&--filled,
	&--play-animation {
		background-color: var(--color-content);
		color: var(--color-background);
	}

	&--s {
		gap: 6px;
		padding-block: 6px;
		padding-inline: var(--v-button-padding-inline, 14px);
	}
}

.icon {
	flex-shrink: 0;
	margin: var(--v-button-icon-margin, 0);
}

.label {
	white-space: nowrap;
}
</style>
