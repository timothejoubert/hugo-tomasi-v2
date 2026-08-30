<script  lang="ts" setup>
import ScssGrid from '~/assets/scss/export/_grid.module.scss'

const maxColumnLength = Math.max(...Object.values(ScssGrid).map(v => Number(v)))
const isVisible = ref(false)

function onKeyDown(e: KeyboardEvent) {
    const isValidKeyDown = e.shiftKey && (e.key === 'g' || e.key === 'G')
    if (isValidKeyDown) isVisible.value = !isVisible.value
}

onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
    <ul
        v-show="isVisible"
        :class="$style.root"
        class="grid"
        aria-hidden="true"
    >
        <li
            v-for="index in maxColumnLength"
            :key="index"
            :class="$style.item"
        />
    </ul>
</template>

<style lang="scss" module>
.root {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: var(--grid-margin, var(--gutter));
    left: var(--grid-margin, var(--gutter));
    min-height: 100vh;
    padding-left: initial;
    grid-template-rows: 1fr;
    margin-block: initial;
    pointer-events: none;
}

.item {
    min-height: 100%;
    background-color: rgb(255, 0, 0, 10%);
    list-style: none;
}
</style>
