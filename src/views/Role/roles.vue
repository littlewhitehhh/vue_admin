<template>
  <div class="roles">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- container -->
      <div class="container">
        <!-- 添加角色按钮 -->
        <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>

        <!-- 数据表格 -->
      
        <el-table
          :data="rolesData" 
          size="mini"
          style="width:100%" >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 栅格布局 -->
              <!-- 第一层遍历   -->
              <el-row :class="['bdbottom', index == 0?'bdtop':'','vcenter']" :key = " item.id" v-for = "(item,index) in scope.row.children" >
                <!-- 渲染以及权限 -->
                <el-col :span = "5">
                  <el-tag closable @close ="removeRightById(scope.row,item2.id)" >{{item.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                  <!-- 渲染二级三级权限 -->
                <el-col :span = "19">
                   <!-- 通过for循环渲染二级权限 -->
                    <el-row :key="item1.id" v-for="(item1,index2) in item.children" :class="[index2 ==0?'':'bdtop','vcenter']">
                    <el-col :span="6">
                      <el-tag type="success" closable  @close ="removeRightById(scope.row,item1.id)" >{{item1.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag :key = 'item2.id' v-for="(item2) in item1.children" type="warning" closable @close ="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>

                     </el-col>
                 </el-row>
                </el-col>
                  
                  <!-- <el-col ：span='5'> -->
                    <!-- <el-tag closable type="success" >{{secondItem.authName}}</el-tag> -->
                  <!-- </el-col> -->
                  <!-- 第三层遍历 -->
                  <!-- <el-col :span="19">
                   
                      <el-tag closable type="warning" v-for="(lastItem ,id3) in secondItem.children " :key="id3">{{lastItem.authName}}</el-tag>
                  </el-col> -->
            


              
            </el-row>
                              
              
            </template>

          </el-table-column>
          <el-table-column label="#" type="index"></el-table-column>

          <el-table-column prop="roleName" label="角色名称"></el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作" width="450px">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="showEditRoleDialog(scope.row.id)"
                >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteRoleDialog(scope.row.id)"
                >删除</el-button>
                <el-button
                size="mini"
                type="warning"
                @click="showRightDialog(scope.row)"
                >分配权限</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>



      <!-- 添加角色对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialogVisible"
        width="40%"
        @close='closeAddRoleDialog'>
        <!-- 添加角色表单 -->
        <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px">
            <el-form-item label=" 角色名称" prop="roleName">
              <el-input v-model="addRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="addRoleForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddRoleDialog">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色对话框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editRoleDialogVisible"
        width="40%"
        @close='closeEditRoleDialog'>
        <!-- 添加角色表单 -->
        <el-form :model="editRoleForm"  ref="editRoleFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="editRoleForm.roleName" disabled></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="editRoleForm.roleDesc"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeEditRoleDialog">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限对话框 -->
      <el-dialog
        title="权限分配"
        :visible.sync="rightDialogVisible"
        width="40%"
        @close='closeRightsDialog'>
        <!-- 权限树 -->
          <el-tree
            :data="rightLists"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="treeRef"
            
            :default-checked-keys="defKays"
            :props="defaultProps"
          >
          </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeRightsDialog">取 消</el-button>
          <el-button type="primary" @click="rightSubmit">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Roles',
  data() {
    return {
      // 角色信息
      rolesData:[],

      // 添加角色
      // 控制添加角色对话框显示与隐藏
      addRoleDialogVisible:false,
      // 添加角色表单
      addRoleForm:{
        roleName:'',
        roleDesc:'',
      },
      //添加角色表单验证
      addRoleFormRules:{
        roleName:[
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        
      },

      // 编辑角色
       editRoleDialogVisible:false,
      //  编辑角色表单
       editRoleForm:{
        roleId:0,
        roleName:'',
        roleDesc:''
       },

      //  角色权限分配
      rightDialogVisible:false,
      // 角色权限列表
      rightLists:[],
      // 当前需要分配角色的id
      roleID:0,
      defKays:[],
      defaultProps:{
        children:'children',
        label:'authName'
      }
      
    }
  },
  mounted() {
    this.getRoleData()
  },
  methods: {
    //  获取角色信息数据
    getRoleData(){
      this.$require.get('roles')
        .then(res=>{
          // console.log(res);
          if(res.data.meta.status!=200){
            this.$confirm('获取角色列表失败')
          }else{
            this.rolesData = res.data.data
          }
        })
    },


    //添加角色
    // 显示添加角色对话框 
    showAddRoleDialog(){
      this.addRoleDialogVisible = true
    },
    // 关闭添加角色对话框
    closeAddRoleDialog(){
      this.addRoleDialogVisible = false
      // console.log(this.$refs.addRoleFormRef);
      this.$refs.addRoleFormRef.resetFields()
    },
    // 提交添加角色
    async addRoles(){
     const res= await this.$require.post('roles',this.addRoleForm)
      
        if(res.data.meta.status !=201){
          this.$confirm(res.data.meta.msg)
        }else{
          this.$message.success(res.data.meta.msg)
          this.getRoleData()
          this.closeAddRoleDialog()
        }

      
      
    },


    // 编辑角色
     // 显示编辑角色对话框
    showEditRoleDialog(id){
      this.editRoleDialogVisible=true
      // console.log(id);
      this.$require.get(`roles/${id}`)
        .then(res=>{
          // console.log(res);
          this.editRoleForm = res.data.data
          

        })
    },
   // 关闭编辑角色对话框
    closeEditRoleDialog(){
      this.editRoleDialogVisible = false
      // console.log(this.$refs.addRoleFormRef);
      
    },

    //提交编辑
    editRoles(){
      this.$require.put(`roles/${this.editRoleForm.roleId}`,this.editRoleForm)
        .then(res=>{
          console.log(res);
          if(res.data.meta.status !=200){
            this.$confirm(res.data.meta.msg)
          }else{
            this.getRoleData()
             this.editRoleDialogVisible = false
            this.$message.success(res.data.meta.msg)
          }
        })
    },


    // 删除角色
   deleteRoleDialog(id){
         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$require.delete(`roles/${id}`)
            .then(()=>{
              this.getRoleData()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },

    // 权限分配
    // 显示角色分配对话框
    showRightDialog(role){
      // console.log(data);
      this.roleID = role.id
      // 查询所有权限列表
      this.$require.get(`rights/tree`)
      .then(res=>{
        // console.log(res); 
        this.rightLists = res.data.data  
      })
      // 获取当前角色的权限
      this.getLeafKay(role,this.defKays)
      this.rightDialogVisible=true 
      // console.log(this.defKays);
    },
    //通过递归的方式，获取所有角色下的三级权限id，并保存带数组中
    getLeafKay(node,arr){
      // 如果当前node节点不包含children属性则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }else{
        node.children.forEach(item=>{
          this.getLeafKay(item,arr)
        })
      }
    },

    // 关闭分配权限对话框
    closeRightsDialog(){
      // 重置数组
      this.defKays =[];
      this.rightDialogVisible=false  
    },

    //提交角色分配
    rightSubmit(){  

      const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]

       const idStr = keys.join(',')
       this.$require.post(`roles/${this.roleID}/rights`,{rids:idStr})
        .then(res=>{
          // console.log(res);
          if(res.data.meta.status !=200){
            this.$confirm(res.data.meta.msg)
          } else{
            this.$message.success(res.data.meta.msg)
             this.getRoleData();
            this.rightDialogVisible=false
          }
         
        })
      // this.rightDialogVisible=false  

    },
    //删除角色权限
    removeRightById(row,id){
      console.log(row,id);
      this.$require.delete(`roles/${row.id}/rights/${id}`)
        .then(res=>{
          console.log(res);
          if(res.data.meta.status !=200){
            this.$confirm(res.data.meta.msg)
          }else{
            this.$message.success(res.data.meta.msg)
            row.children = res.data.data
          }
        })
    }


  
    
  }
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
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}

</style>