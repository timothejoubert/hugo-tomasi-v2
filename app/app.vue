<script lang="ts" setup>
</script>

<template>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="#DBE6EC" />

    <VSkipLink />

    <VMainNav />

    <NuxtPage />

    <VFooter />

    <DevOnly>
        <VGridVisualizer />
    </DevOnly>
</template>
