<script lang="ts" setup>
const { mainMenu } = useCommonContent()
const linkList = computed(() => mainMenu.value?.links || [])
</script>

<template>
  <nav v-if="linkList.length" :class="$style.root">
    <ul :class="$style.list">
      <li v-for="(item, i) in linkList" :key="i">
        <VLink
          :reference="item.link"
          class="text-over-title-s"
          :class="$style.item"
          :nuxt-link-props="{ prefetch: true }"
        >
          <VSplitWord :content="item.label" />
        </VLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" module>
.root {
  text-transform: uppercase;
}

.list {
  display: flex;
  gap: rem(16);
}

.item {
  position: relative;

  &:global(.router-link-exact-active)::after,
  &:not(#{&}--home):global(.nuxt-link-active)::after {
    position: absolute;
    right: 0;
    bottom: rem(-2);
    left: 0;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.1);
    content: '';
  }
}
</style>
