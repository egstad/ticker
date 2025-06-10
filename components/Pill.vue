<template>
  <div class="pill">
    <slot />
  </div>
</template>

<style scoped>
.pill {
  display: inline-flex;
  padding: 0 4px;
  border-radius: 4px;
  font-size: 10px;
  font-family: "LTUnivers Typewriter", monospace;
  letter-spacing: 0.05em;
  font-weight: normal;
  text-transform: uppercase;
  background: #e9e9e9;
  color: gray;
}

:deep(input),
:deep(button) {
  appearance: none;
  border: 0;
  background: 0;
  display: flex;
  color: inherit;
  width: auto;
  outline: 0;
  padding: 0;
  margin: 0;
  text-transform: inherit;
  cursor: pointer;
}
</style>
