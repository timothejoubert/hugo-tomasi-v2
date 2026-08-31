<script lang="ts" setup>
const props = withDefaults(defineProps<{
    src?: string
    cols?: number
    rows?: number
}>(), {
    src: '/images/poc/face-sprite-horizontal.webp',
    cols: 51,
    rows: 1,
})

const { style, activate, deactivate } = useSpriteHover({ cols: props.cols, rows: props.rows })

onMounted(activate)
onBeforeUnmount(deactivate)
</script>

<template>
    <div
        :class="$style.root"
        :style="{ ...style, backgroundImage: `url(${props.src})` }"
    />
</template>

<style lang="scss" module>
.root {
    width: 300px;
    height: 300px;
    background-repeat: no-repeat;
}
</style>
