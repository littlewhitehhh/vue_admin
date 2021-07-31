<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
             <!-- 添加分类按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
                <!-- 是否有效模板 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color:red;"></i>
                </template>
                <!-- 排序模板 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <!-- 操作模板 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click = shwoeditCateDialog(scope.row.cat_id)>编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed" ref="addCateFormRef">
            <!-- 添加分类的表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!-- options 用来指定数据源 -->
                    <!-- props 用来指定配置对象 -->
                    <!-- change-on-select 不能用 这类有bug 设置 multiple: true, checkStrictly: true -->
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChanged" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 编辑商品对话框 -->
        <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="50%" @close="editCateDialogClosed" >
           <el-form :model="editCateForm" ref="editCateFormRef" label-width="100px" :rules="editCateFormRules">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
           </el-form>
           <span slot="footer" class="dialog-footer">
                <el-button @click=" editCateDialogClosed">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            // 查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类的数据列表 默认为空
            cateList: [],
            // 总数据条数
            total: 0,
            // 为 table 指定列的定义
            columns: [{
                label: '分类名称',
                prop: 'cat_name'
            }, {
                label: '是否有效',
                // 将当前列定义为模板列
                type: 'template',
                // 表示当前模板页使用的模板名称
                template: 'isok'
            }, {
                label: '排序',
                // 将当前列定义为模板列
                type: 'template',
                // 表示当前模板页使用的模板名称
                template: 'order'
            }, {
                label: '操作',
                // 将当前列定义为模板列
                type: 'template',
                // 表示当前模板页使用的模板名称
                template: 'opt'
            }],
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                // 将要添加的分类名称
                cat_name: '',
                // 父级分类的id
                cat_pid: 0,
                // 分类等级 默认添加一级分类
                cat_level: 0
            },
            // 添加分类表单的验证规则对象
            addCateFormRules: {
                cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
            },
            // 父级分类列表数据
            parentCateList: [],
            // 指定级联选择器的配置对象
            cascaderProps: {
                expandTrigger: 'hover',
                //设置为可选中一级分类
                checkStrictly: true,
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 选中父级分类的id数组
            selectedKeys: [],


            // 编辑商品
            editCateDialogVisible:false,
            editCateForm:{},
            editCateFormRules: {
                cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
            },
        }
    },
    created: function() {
        this.getCateList();
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const { data: res} = await this.$require.get('categories', { params: this.queryInfo});
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败');
            };
            // console.log(res.data);
            // 把数据列表赋值给 cateList
            this.cateList = res.data.result;
            // 为总数据条数赋值
            this.total = res.data.total;
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },
        // 监听pegenum的改变事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        // 点击按钮 展示添加分类的对话框
        showAddCateDialog() {
            // 获取父级分类的数据列表
            this.getParentCateList();
            // 展示对话框
            this.addCateDialogVisible = true;
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const { data: res} = await this.$require.get('categories', {params: {type: 2}});
            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类数据失败');
            };
            // console.log(res.data);
            this.parentCateList = res.data;
        },
        // 选择项发生变化触发
        parentCateChanged() {
            console.log(this.selectedKeys);
            // 如果 selectedKeys 数组中 length 长度大于0 证明选中的父级分类 反之 就说明没有选中任何父级分类
            if (this.selectedKeys.length > 0) {
					//父级分类的id
					this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
					//当前添加的分类等级
					this.addCateForm.cat_level = this.selectedKeys.length;
				} else {
					//父级分类的id
					this.addCateForm.cat_pid = 0;
					//当前添加的分类等级
					this.addCateForm.cat_level = 0;
				}
        },
        // 点击按钮 添加新的分类
        addCate() {
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$require.post('categories', this.addCateForm);
                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败');
                };
                this.$message.success('添加分类成功');
                this.getCateList();
                this.addCateDialogVisible = false;
            })
        },
        // 监听添加分类对话框的关闭事件
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys = [];
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
        },


        // 修改分类
        shwoeditCateDialog(id){
          // console.log(id); 
          this.editCateDialogVisible = true
          this.$require.get(`categories/${id}`)
            .then(res=>{
              console.log(res);
              this.editCateForm = res.data.data
            })
        },
        editCateDialogClosed(){
            this.editCateDialogVisible = false
        },
        editCate(){
          this.$require.put(`categories/${this.editCateForm.cat_id}`,this.editCateForm)
          .then(res=>{
            // console.log(res);
            if(res.data.meta.status !=200){
              return this.$confirm(res.data.meta.msg)
            }else{
              this.$message.success(res.data.meta.msg)
              this.getCateList()
               this.editCateDialogVisible = false

            }
          })
        },


        // 删除
        deleteCate(id){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
          }).then(() => {
                this.$require.delete(`categories/${id}`)
                  .then(()=>{
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    
                    });
                    this.getCateList()
                  })
                
          }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
                });          
          });
        }
    }
}
</script>

<style  scoped>
.el-card {
  margin-top:20px
}
.treeTable {
    margin-top: 15px;
}

.el-cascader {
    width: 100%;
}

</style>

