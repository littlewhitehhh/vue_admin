<template>
  <div class="rights">
    <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- container -->
      <div class="container">
        <!-- 表格 -->
        <el-table
          :data="rightsList"
          stripe size="mini"
          style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
            <el-table-column  prop="authName" label="权限名称" width="300"></el-table-column>
            <el-table-column prop="path" label="路径" width="300"></el-table-column>
            <el-table-column label="权限等级">
              <template slot-scope="scope">
              
                <el-tag v-if="scope.row.level ==0">一级</el-tag>
                <el-tag v-else-if="scope.row.level ==1" type="success">二级</el-tag>  
                <el-tag v-else type="warning">三级</el-tag>
              </template>
            </el-table-column>
        </el-table>
      </div>
  </div>
  

</template>

<script>
export default {
  name:'Rights',
  data() {
    return {
      rightsList:[],
    }
  },
  mounted() {
    this.getRightsList()
  },
  methods: {
    // 获取所有权限
    getRightsList(){
       this.$require.get(`rights/list`)
          .then(res=>{
            console.log(res); 
            this.rightsList = res.data.data  
          })
    }
  },
}
</script>

<style scoped>
.el-breadcrumb {
  margin: 10px 0 20px 0;
}
.container {
  background-color: #fff;
  padding: 20px;
  
}
</style>