<template>
  <header class="site-header">
    <h1>
      <Pill>
        <NuxtLink to="/">ticker</NuxtLink>
      </Pill>
      <span class="sr-only">Counter by Design Business Company</span>
    </h1>

    <nav>
      <ul>
        <li v-for="(link, index) in links" :key="index">
          <Pill
            ><NuxtLink :to="link.url">{{ link.text }}</NuxtLink></Pill
          >
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
const links = [
  {
    url: "/counter",
    text: "counter",
  },
];
</script>

<style scoped>
.site-header {
  display: flex;
  width: 100%;
  align-items: start;
  justify-content: space-between;
  padding: 8px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

h1 {
  margin: 0;
  padding: 0;
  display: flex;
  margin-right: 8px;
}

nav {
  margin: 0;
  padding: 0;
  display: flex;
  width: 100%;
}

ul {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: end;
  width: 100%;
  gap: 2px;

  li {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
}

a {
  text-decoration: none;
  color: currentColor;
}
</style>
