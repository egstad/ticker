<template>
  <header class="tally-title">
    <h2><slot name="title">Default Title</slot></h2>
    <p><slot name="subtitle">Default Subtitle</slot></p>
  </header>
</template>

<style scoped>
.tally-title {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 200px;
  flex-direction: column;
  width: 100%;
}

h2 {
  font-family: "Arial Narrow", sans-serif;
  font-size: clamp(28px, 2.5vw, 64px);
  line-height: 1.1;
  font-weight: normal;
  text-transform: uppercase;
  margin: 0;
  margin-bottom: 8px;
}

p {
  font-size: clamp(14px, 1vw, 24px);
  color: #666;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
