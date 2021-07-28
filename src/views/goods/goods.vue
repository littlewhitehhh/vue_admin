<template>
  <div class="goods">
    <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- container -->
      <div class="container"> 
        <!-- 搜索框和添加商品按钮 -->

         <!-- 搜索框 -->
      <el-input placeholder="请输入搜索内容" v-model="getGoodsObj.query" class="searchInput" clearable @clear="getGoodsList">
        <el-button slot="append" icon="el-icon-search" @click="getGoodsList" ></el-button>
      </el-input>
      <!-- 添加用户按钮 -->
      <el-button type="primary" class="addGoodsBtn" @click="addGoods">添加商品</el-button>
        <!-- 商品表单 -->
        <el-table
          :data="goodsList"
          stripe size="mini"
          style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" width="400"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" ></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量(kg)"  ></el-table-column>
          <el-table-column label="创建时间" >
            <template slot-scope="scope">
              {{scope.row.add_time | dataFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="showEditDialog(scope.row.goods_id)"
                 >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteGoods(scope.row.goods_id)"
                >删除</el-button> 
            </template>
          </el-table-column>

        </el-table>
    </div>
      <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="getGoodsObj.pagenum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="getGoodsObj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 编辑商品对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close = "closeEditDialog">
      <!-- 商品信息表单 -->
      <el-form ref="editGoodsFormRef" :model="editGoodsForm" :rules="editGoodsFormRules" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
         <el-form-item label="商品价格">
          <el-input v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" @click="editGoodsSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>


  
</template>

<script>
export default {
  name:'Goods',
  data() {
    return {
      // 商品列表
      goodsList:[],
      // 获取商品列表参数对象
      getGoodsObj:{
        //  搜索关键字
        query:'',
        // 当前页码值
        pagenum:1,
        // 每页显示多少条数据
        pagesize:5
      },
      //商品列表总条数
      total:0, 

      // 编辑修改商品对话框
      // 控制修改商品对话框的显示和隐藏
      editDialogVisible:false,
      // 编辑商品表单
      editGoodsForm:{},
      // 规则验证
      editGoodsFormRules:{
        goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight:[
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ]
      }
      
    }
  },
 
  
  mounted() {
   this.getGoodsList() 
  },
 
  methods: {
    // 获取商品列表
    getGoodsList(){
      this.$require.get('goods',{params:this.getGoodsObj})
        .then(res=>{
          // console.log(res.data.data);
          this.goodsList = res.data.data.goods
          this.total = res.data.data.total
        })
    },

    // 分页功能
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.getGoodsObj.pagesize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.getGoodsObj.pagenum = val
      this.getGoodsList()
    },

    // 编辑商品对话框显示
    showEditDialog(id){
      // console.log(id);
      this.$require.get(`goods/${id}`)
        .then(res=>{
          // console.log(res);
          this.editGoodsForm = res.data.data
        })
      this.editDialogVisible = true
      
    },
    // 关闭修改信息对话框
    closeEditDialog(){
      this.editDialogVisible = false
    },
    // 提交修改的商品信息
    editGoodsSubmit(){
      console.log(this.$refs.editGoodsFormRef);
      this.$require.put(`goods/${this.editGoodsForm.goods_id}`,this.editGoodsForm)
        .then(res=>{
          if(res.data.meta.status !=200){
            this.$confirm(res.data.meta.msg)
          }else {
            this.$message.success(res.data.meta.msg)
            this.getGoodsList()
            this.editDialogVisible = false
          }
        })
      
    },

    // 删除商品
    deleteGoods(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$require.delete(`goods/${id}`)
            .then(res=>{
              if(res.data.meta.status !=200){
                this.$confirm(res.data.meta.msg)
              }else{
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getGoodsList()
              }
            })
         
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },

    // 跳转添加商品页面
    addGoods(){
      this.$router.push('/goods/add')
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
.searchInput{
    
  width: 400px;
}
.addGoodsBtn {
  margin-left: 40px;
}
</style>