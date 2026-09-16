<script setup lang="ts">
const { data: setting } = await usePrismicSettingsDocument()

const runtimeConfig = useRuntimeConfig()
const siteName = computed(() => runtimeConfig.public.site.name)

const credits = computed(() => setting.value?.data?.credits)
</script>

<template>
    <footer
        :class="$style.root"
        class="text-body-xs"
    >
        <div
            :class="$style.infos"
            class="markdown"
        >
            <span
                :class="$style.copyright"
            >© {{ siteName }} {{ new Date().getFullYear() }}</span>
            <span
                :class="$style.separator"
            />
            <VText
                v-if="credits"
                :content="credits"
                inline
            />
        </div>
        <VSocials
            v-if="setting?.data?.publisher_socials?.length"
            :field="setting.data?.publisher_socials"
            :class="$style.socials"
        />
    </footer>
</template>

<style lang="scss" module>
.root {
    @include theme('dark');

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin: auto var(--grid-margin) var(--grid-margin);
    background-color: var(--color-background);
    color: var(--color-content);
    gap: 24px 18px;
    padding-block: 20px 24px;
    padding-inline: 20px;

    @include media('>=md') {
        justify-content: space-between;
        border-radius: 16px;
        margin-bottom: 24px;
        padding-block: 19px 24px;
        padding-inline: 32px;
    }
}

.separator {
    &::after {
        display: inline;
        content: '|';
    }
}

.infos {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 4px 1ch;

    a {
        color: inherit;
    }

    p {
        display: inline-block;
        margin-block: 0;
        opacity: 0.7;
    }
}

.socials {
    // margin-left: auto;
}
</style>
