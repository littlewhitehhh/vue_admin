<template>
  <div id="app">
   <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name:'App',
  mounted() {
    // console.log(this)
  },
}
</script>
<style>
html,
body,
#app {
    height: 100%;
    margin: 0;
    padding: 0;
    min-width: 1050px;
}
  .el-cascader-panel{
    height: 300px;
  }

</style>
