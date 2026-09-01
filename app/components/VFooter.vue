<script setup lang="ts">
const { data: setting } = await usePrismicSettingsDocument()

const runtimeConfig = useRuntimeConfig()
const siteName = computed(() => runtimeConfig.public.site.name)

const credits = computed(() => setting.value?.data?.credits)
</script>

<template>
    <footer :class="$style.root">
        <div :class="$style.infos" class="markdown">
            <span
                :class="$style.copyright"
            >© {{ siteName }} {{ new Date().getFullYear() }}</span>
            <VText
                v-if="credits"
                :content="credits"
                inline
            />
        </div>
        <VSocials
            v-if="setting?.data?.publisher_socials?.length"
            :field="setting.data?.publisher_socials"
        />
    </footer>
</template>

<style lang="scss" module>
.root {
    @include theme('dark');

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 19px 32px 24px;
    border-radius: 16px;
    margin: auto var(--grid-margin) 24px;
    background-color: var(--color-background);
    color: var(--color-content);
}

.copyright {
    font-size: 14px;

    &:not(:last-child)::after {
        display: inline;
        content: '|';
        margin-inline: 1ch;
    }
}

.infos p {
    display: inline-block;
    font-size: 14px;
    margin-block: 0;
    opacity: 0.7;
}


</style>
