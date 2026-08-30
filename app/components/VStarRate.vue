<script lang="ts" setup>
// import IconStar from '~/assets/images/icons/star.svg?sprite'

const props = defineProps<{
    rate: number | string | null
}>()

const RATE_MAX = 20
const DISPLAYED_MAX = 5

const decimalValue = computed(() => {
    const rate = typeof props.rate === 'string' ? parseFloat(props.rate) : props.rate
    return ((rate ?? 0) / RATE_MAX)
})

const rateValue = computed(() => {
    return decimalValue.value * DISPLAYED_MAX
})
const rateValueCeil = computed(() => {
    return Math.ceil(rateValue.value)
})

const rest = computed(() => {
    return rateValueCeil.value - rateValue.value
})
</script>

<template>
    <div
        :class="$style.root"
        :aria-label="`${$t('rate_label', { rate: props.rate, max: RATE_MAX })}`"
    >
        <VIcon
            v-for="i in rateValueCeil"
            :key="i"
            name="material-symbols:star"
            :class="$style.star"
        />
        <VIcon
            v-if="rest > 0 && rest < 1"
            name="material-symbols:star"
            :class="[$style.star, $style['star--rest']]"
            :style="{
                'clip-path': `inset(0 0 0 ${100 - (rest * 100)}%)`,
            }"
        />
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.star {
    color: inherit;
}

.star--rest {
    position: absolute;
    right: 0;
    color: var(--v-start-rest-color);
    opacity: 0.9;
}
</style>
