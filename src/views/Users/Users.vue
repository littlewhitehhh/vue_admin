<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容区 -->
    <div class="container">
      <!-- 搜索框 -->
      <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" class="searchInput" clearable @clear="getUserData">
        <el-button slot="append" icon="el-icon-search" @click="getUserData"></el-button>
      </el-input>
      <!-- 添加用户按钮 -->
      <el-button type="primary" @click="openDialog">添加用户</el-button>

      <!-- 用户列表 -->
      <el-table
        :data="tableData"
        stripe border size="mini" 
        style="width: 100%">
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch style="display: block" v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="500px">
          <template slot-scope="scope">
            <el-button
              size="mini" @click="showEditDialog(scope.row.id)">修改</el-button>
            <el-button
              size="mini"
              type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
              <el-button
              size="mini"
              type="danger">用户权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    


    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="50%"
      @close="closeDialog">
      <el-form :model=" addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditDialog">
      <el-form :model="editUserForm" :rules="editUserRules" ref="editUserFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户权限对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeEditDialog">
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Users',
  data() {
    return {
      // 表格数据
      tableData: [],
      // 获取用户列表的参数对象
      queryInfo:{
        /* 搜索关键字 */
        query:'',
        /* 当前页数 */
        pagenum: 1,
        /* 当前每页显示多少数据 */
        pagesize:100
      },

      // 添加用户
      // 控制添加用户对话框显示与隐藏
      addUserDialogVisible: false,
      // 添加用户表单
      addUserForm:{
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      // 添加用户表单验证规则
      addUserRules:{
        username:[
           { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
          password:[
           { required: true, message: '请输入密码', trigger: 'blur' },
        ],
         email:[
           { required: true, message: '请输入邮箱', trigger: 'blur' },
        ],
         mobile:[
           { required: true, message: '请输入手机号码', trigger: 'blur' },
        ]

      },


      // 修改用户
      // 控制修改用户对话框显示与隐藏
      editDialogVisible:false,
      // 修改用户表单数据
      editUserForm:{
        username:'',
        email:'',
        mobile:''
      },
      // 修改用户表单验证
      editUserRules:{

      },
      // 当前所修改数据的id
      currentID:'',
    }
  },
  mounted() {
    this.getUserData()
  },
  methods: {
    // 获取用户数据
    getUserData(){
      this.$require.get('users',{
        params: this.queryInfo
      })
      .then(res=>{
          // console.log(res.data.data.users);
          this.tableData = res.data.data.users
      }).catch(err=>{
        console.log(err);
      })
      // console.log(this.$refs);
    },
  // 搜索用户



    // 添加用户
    //打开添加用户信息对话框
    openDialog(){
      this.addUserDialogVisible = true
      // console.log(this.$refs.validateField());
    },
    // 关闭添加用户信息对话框并提交到服务器
    addUser(){
      this.addUserDialogVisible = false
      console.log(this.addUserForm);
      
      this.$require.post('users',this.addUserForm)
        .then(res=>{
          console.log(res);
          if(res.data.meta.status){
            this.$message.success(res.data.meta.msg)
            
            this.getUserData()
          }else{
            this.$confirm('添加用户失败')
          }
        })
        this.$refs.addUserFormRef.resetFields();
    },  
    // 关闭对话框并清除信息
    closeDialog(){
      this.addUserDialogVisible = false
      this.$refs.addUserFormRef.resetFields();
    },


    // 修改用户状态
    changeState(data){
      // console.log(scope);
      const uid = data.id
      const state = data.mg_state 
     this.$require.put(`/users/${uid}/state/${state}`)
     .then(res=>{
      //  console.log(res);
      if(res.data.meta.status !=200){
        this.$confirm(res.data.meta.msg)
      }else{
        this.$message.success(res.data.meta.msg)
      }
     })
    }, 
    
    
    // 修改用户信息
    //打开用户信息对话框
    showEditDialog(id){
      this.editDialogVisible = true
      this.currentID = id
      // console.log(id);
      this.$require.get(`users/${id}`)
        .then(res=>{
          if(res.data.meta.status !=200){
             this.$confirm('查询用户失败')
          }else{
            console.log(res.data.data);
            this.editUserForm = res.data.data
            this.getUserData()
          }    
        })
        
    },
    // 关闭用户信息对话框
    closeEditDialog(){
      this.editDialogVisible = false
    },
    // 提交修改用户信息并关闭对话框
    editUser(){
      // console.log(this.currentID);
      this.$require.put(`users/${this.currentID}`,this.editUserForm)
        .then(res=>{
          // console.log(res);
          if(res.data.meta.status !=200){
            this.$confirm(res.data.meta.msg)
          }else{
            
            this.$message.success(res.data.meta.msg)
            this.editDialogVisible = false
            this.getUserData()
          }
        })
        
    },

    // 删除用户
  async deleteUser(id){
    const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>{return err})
        console.log(res);
        if(res != "confirm"){
           return this.$message.info('已经取消删除！')
        }else{
          const {data:res}= await this.$require.delete(`users/${id}`)
          if(res.meta.status !=200){
                    this.$message.error('删除失败！')
                }else{
                    this.$message.success('已经删除！');
                    this.getUserData();
                }
        }
      
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
.el-button {
  margin-left: 20px;
}
.el-table{
  margin-top:20px ;
}
</style>