<template>
  <div id="app" class="mb-4">
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style lang="scss">
@import "styles/custom-bootstrap";
#app{
  min-height: 990px;
  background-color: #d5d5d5;
}
</style>
