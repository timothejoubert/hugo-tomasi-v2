<script lang="ts" setup>
import { SKIP_LINKS } from '~/constants/skip-links'
</script>

<template>
    <nav
        :class="$style.root"
        aria-label="Liens d'évitement"
        role="navigation"
    >
        <a
            v-for="(link, key) in SKIP_LINKS"
            :key="key"
            :href="`#${link.elementId}`"
            :class="$style.link"
        >
            {{ $t(link.label) }}
        </a>
    </nav>
</template>

<style lang="scss" module>
.root {
    position: absolute;
    z-index: 9999;
    top: 0;
    left: 0;
    padding: 12px 20px;
    background-color: var(--color-surface);
    opacity: 0;
    pointer-events: none;

    &:focus-within {
        opacity: 1;
        pointer-events: initial;
    }
}

.link {
    display: block;
    color: var(--color-content);
}
</style>
