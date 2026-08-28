<script lang="ts" setup>
await usePrismicPersonSchemaOrg()
</script>

<template>
	<NuxtRouteAnnouncer />
	<NuxtLoadingIndicator color="#DBE6EC" />

	<VSkipLink />

	<VMainNav />

	<NuxtPage />

	<DevOnly>
		<VGridVisualizer />
	</DevOnly>
</template>
