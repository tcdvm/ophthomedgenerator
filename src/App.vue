<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <OphthoMedGen />
  </div>
</template>

<script>
import OphthoMedGen from './components/OphthoMedGen.vue'

export default {
  name: 'app',
  components: {
    OphthoMedGen
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
