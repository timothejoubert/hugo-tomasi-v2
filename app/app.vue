<script lang="ts" setup>
</script>

<template>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="#DBE6EC" />

    <VSkipLink />

    <VMainNav />

    <VMediaViewer />

    <NuxtPage />

    <VFooter />

    <DevOnly>
        <VGridVisualizer />
    </DevOnly>
</template>
