<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.ABOUT)
usePrismicMeta(document, { schemaOrgType: 'AboutPage' })


const { data: settings } = await usePrismicSettingsDocument()
const socials = computed(() => settings.value?.data?.publisher_socials)
const email = computed(() => settings.value?.data?.publisher_email || '')


</script>

<template>
    <VPageWrapper
        :slices="document?.data.slices"
        :class="$style.root"
    >
        <header
            class="grid-extended"
            :class="$style.header"
        >
            <div :class="$style['media-wrapper']">

                <VSpriteFaceHover />
            </div>
            <div :class="$style.body">
                <h1
                    v-if="document?.data.title"
                    class="text-h1 visually-hidden"
                >
                    {{ document?.data.title }}
                </h1>
                <VText
                    v-if="document?.data.content"
                    :content="document?.data.content"
                    :class="$style.content"
                    class="text-h3"
                />
                <VText
                    v-if="document?.data.excerpt"
                    :content="document?.data.excerpt"
                    :class="$style.excerpt"
                />
                <VClipBoard
                    v-if="email"
                    :content="email"
                    :class="$style.email"
                    class="text-h4"
                />
                <VSocials
                    v-if="socials?.length"
                    :field="socials"
                    :class="$style.socials"
                    output="link"
                />
            </div>
        </header>
    </VPageWrapper>
</template>
<style lang="scss" module>
.header {
    align-items: center;
    padding-top: 102px;
}

.media-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--common-border-radius);
    grid-column: 1 / -1;
    padding-block: 62px;

    // background-color: color-mix(in srgb, var(--color-content) 5%, transparent);

    @include media('>=md') {
        grid-column: 1 / 7;
    }
}

.body {
    grid-column: 1 / -1;

    @include media('>=md') {
        grid-column: 7 / -1;
    }
}

.content {
    max-width: 18ch;

    p {
        margin-block: 0;
    }
}

.email {
    margin-block: 32px 0;
}

.socials {
    --v-socials-gap: 20px;

    margin-block: 22px 0;
}
</style>
