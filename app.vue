<template>
  <div class="site">
    <SiteNav />
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  titleTemplate: (productCategory) => {
    return productCategory ? `Counter • ${productCategory}` : "Counter";
  },
});
</script>

<style>
.site {
  display: flex;
  flex-direction: column;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
