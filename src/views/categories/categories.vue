<template>
  <div class="categories">
    
    <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片 -->
      <el-card>
        <!-- 添加分类按钮 -->
        <el-button type="primary">添加分类</el-button>

        <!-- 商品分类表单 -->
        <el-table :data="cateList" style="width: 100%" size="mini ">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="分类名称" width="180" prop="cat_name"></el-table-column>
          <el-table-column label="是够有效" width="180" prop="cat_deleted"></el-table-column>
          <el-table-column label="排序"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-card>
  </div>
</template>

<script>
export default {  
  name:'categories',
  data() {
    return {
      cateList:[],

      //查询cataList请求参数
      queryInfo:{   
        type:3,
        pagenum:1,
        pagesize:5,
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList(){
      this.$require.get('categories',{params:this.queryInfo})
      .then(res=>{
        console.log(res);
        this.cateList = res.data.data.result
      })
    }
  },
}
</script>

<style scoped>
.el-card{
  margin: 20px 0;
}
.el-button {
  margin-bottom: 20px;
}
</style>