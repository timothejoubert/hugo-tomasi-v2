<script lang="ts" setup>
import LogoMain from '~/assets/images/logo.svg?component'

const { siteName, homeBasePath } = useCommonContent()

const { locale } = useI18n()
</script>

<template>
  <div :class="$style.root">
    <NuxtLink :to="homeBasePath" :class="$style.home">
      <LogoMain viewBox="0 0 86 80" :class="$style.logo" />
      <div :class="$style['logo-text']">{{ siteName }}</div>
    </NuxtLink>
    <div>{{ locale }}</div>
    <VTopBarNav :class="$style.nav" />
    <VLocaleSelect />
  </div>
</template>

<style lang="scss" module>
.root {
  position: sticky;
  z-index: 101;
  top: 0;
  display: flex;
  height: rem(76); //$v-top-bar-height;
  align-items: center;
  color: color(white);
  mix-blend-mode: difference;
  padding-inline: var(--page-gutter);
}

.home {
  display: flex;
  align-items: center;
  gap: rem(12);
}

.logo {
  width: rem(32);
  height: auto;
}

.logo-text {
  display: none;
}

.nav {
  margin-right: rem(20);
  margin-left: auto;
}
</style>
