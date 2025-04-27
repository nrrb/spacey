<script setup>
import Starfield from './components/Starfield.vue'
</script>

<template>
  <Starfield />
</template>

<style>
/* Reset default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
}

body {
  font-family: monospace;
  background: #0c0c1d;
  color: white;
  margin: 0;
}

#app {
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  display: block;
}
</style>
