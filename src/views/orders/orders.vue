<template>
<!-- 

    基本功能实现  但没有数据支持  只是模拟部分数据

 -->
  <div class="order">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-input placeholder="请输入订单编号" v-model="queryInfo.query" class="input-with-select" clearable @clear ="getOrdersList">
        <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
      </el-input>

      <!-- 订单表单 -->
      <el-table :data="ordersList" style="width: 100%" size="mini">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status == 1">已付款</el-tag>
            <el-tag type="danger" v-else >未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column  label="下单时间">
          <template slot-scope="scope">
              {{scope.row.create_time | dataFormat }}
            </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.order_id)">编辑</el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressDialog">地址</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 8, 12]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    </el-card>

    <!-- 编辑订单对话框 -->
      <el-dialog title="修改分类" :visible.sync="editOrderDialogVisible" width="50%" @close="editOrderDialogClosed" >
          <el-form :model="editOrderForm" ref="editOrderFormRef" label-width="100px" :rules="editOrderFormRules">
              <el-form-item label="省市区/县" prop="address1">
                  <el-cascader
                    v-model="editOrderForm.address1"
                    :options="cityData"
                    :props="cityProps"
                    ></el-cascader>
              </el-form-item>
              <el-form-item label="详情地址：" prop="address2">
                  <el-input v-model="editOrderForm.address2"></el-input>
              </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
                <el-button @click="editOrderDialogClosed">取 消</el-button>
                <el-button type="primary" @click="editOrder">确 定</el-button>
            </span>
      </el-dialog>


      <!-- 快递进度对话框 -->
      <el-dialog title="修改分类" :visible.sync="progressDialogVisible" width="50%" @close="progressDialogClosed" >

          <!-- 时间线 -->
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in progressInfo"
              :key="index"
              :timestamp="item.ftime">
              {{item.context}}
            </el-timeline-item>
          </el-timeline>
           <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="progressDialogClosed">确 定</el-button>
            </span>
      </el-dialog>
  </div>
</template>

<script>
// 引入城市信息
import  cityData from  './citydata.js'
export default {
  name:'order',
  data() {
    return {
      // 获取订单参数
      queryInfo:{
        // 查询参数
        query:'',
        // 当前页码
        pagenum:1,
        // 每页显示条数
        pagesize:5
      },
      // 订单列表
      ordersList:[],
      // 总共订单条数
      total:0,

      // 城市数据
       cityData:cityData,

      // 编辑订单
      editOrderDialogVisible:false,
      editOrderForm:{
        address1:[],
        address2:'',
      },
     editOrderFormRules:{
                address1:[
                    {required:true,message:'请选择省市区/县',trigger:'blur'}
                ],
                address2:[
                    {required:true,message:'请填写具体地址',trigger:'blur'}
                ]
      },
      cityProps:{
        label:'label',
        value:'value'
      },

      // 模拟进度信息
       progressDialogVisible:false,
       progressInfo:[
                {
                    "time": "2018-05-10 09:39:00",
                    "ftime": "2018-05-10 09:39:00",
                    "context": "已签收,感谢使用顺丰,期待再次为您服务",
                    "location": ""
                },
                {
                    "time": "2018-05-10 08:23:00",
                    "ftime": "2018-05-10 08:23:00",
                    "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                    "location": ""
                },
                {
                    "time": "2018-05-10 07:32:00",
                    "ftime": "2018-05-10 07:32:00",
                    "context": "快件到达 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-10 02:03:00",
                    "ftime": "2018-05-10 02:03:00",
                    "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 23:05:00",
                    "ftime": "2018-05-09 23:05:00",
                    "context": "快件到达 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 21:21:00",
                    "ftime": "2018-05-09 21:21:00",
                    "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 13:07:00",
                    "ftime": "2018-05-09 13:07:00",
                    "context": "顺丰速运 已收取快件",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:25:03",
                    "ftime": "2018-05-09 12:25:03",
                    "context": "卖家发货",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:22:24",
                    "ftime": "2018-05-09 12:22:24",
                    "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                    "location": ""
                },
                {
                    "time": "2018-05-08 21:36:04",
                    "ftime": "2018-05-08 21:36:04",
                    "context": "商品已经下单",
                    "location": ""
                }
            ],
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单列表
    getOrdersList(){
      this.$require.get('orders',{params:this.queryInfo})
        .then(res=>{
          console.log(res.data.data);
          this.ordersList = res.data.data.goods
          this.total = res.data.data.total
        })
    },
    // 分页功能
     handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.queryInfo.pagesize = val
        this.getOrdersList()
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.queryInfo.pagenum = val
        this.getOrdersList()
      },

      // 编辑订单
      showEditDialog(id){
        console.log(id);
        this.editOrderDialogVisible = true
      },
      
      editOrderDialogClosed(){
        this.$refs.editOrderFormRef.resetFields();
        this.editOrderDialogVisible = false
      },
      /* handleChange(value){
        console.log(value);
        this.address1 = value.join(',')
      } */
      editOrder(){
        /* this.$refs.addFormRef.validate( valid => {
                if (!valid) return;  */ 
        this.editOrderDialogVisible = false
        this.$message.success('地址修改成功')
      } ,

      // 地址
      showProgressDialog(){
        this. progressDialogVisible =true
      },
      progressDialogClosed(){
         this. progressDialogVisible =false
      }
  },
}
</script>

<style scoped> 
.el-card {
  margin-top: 20px;
}
.el-input{
  margin-bottom: 20px;
}
</style>