<template>
  <div class="addGoods">
    <el-card >
      <!-- 头部警告 -->
       <el-alert
          show-icon
          title="添加商品信息"
          center
          type="info">
        </el-alert>
         <!-- 步骤条 -->
    <el-steps :active="activeIndex - 0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品照片"></el-step>
      <el-step title="商品内容"></el-step>
     
    </el-steps>

      <!-- <el-tabs tab-position="left" style="height: 200px;" stretch="true">
        <el-tab-pane label="基本信息">
            <el-form label-position="top" label-width="80px" :model="baseInformationForm" :rules="baseInformationFormRules">
              <el-form-item label="商品名称">
                <el-input v-model="baseInformationForm.name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格">
                <el-input v-model="baseInformationForm.region"></el-input>
              </el-form-item>
              <el-form-item label="商品重量">
                <el-input v-model="baseInformationForm.type"></el-input>
              </el-form-item>
              <el-form-item label="商品数量">
                <el-input v-model="baseInformationForm.type"></el-input>
              </el-form-item>
              <el-form-item label="商品分类">
                <el-input v-model="baseInformationForm.type"></el-input>
              </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="配置管理">配置管理</el-tab-pane>
        <el-tab-pane label="角色管理">角色管理</el-tab-pane>
        <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-card> -->

      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- tab栏区域 -->
        <!-- 这里需要字符串类型的activeIndex -->
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave"  @tab-click = "tabClick">
          <!-- :before-leave="beforeTabLeave"  @tab-click = "tabClick" -->
          <!-- tab 基本信息 -->
          <el-tab-pane label="基本信息" name='0'>
            <!-- 商品信息栏 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <!-- 商品价格栏 -->
            <el-form-item label="商品价格" prop="goods_price " >
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <!--商品重量栏 -->
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <!-- 商品重量 -->
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps"  @change="handlechange"></el-cascader> -->
              <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps"  @change="handlechange"></el-cascader>
            </el-form-item>
            <!-- tab 基本信息 -->
          </el-tab-pane>

            <!-- tab 商品参数 -->
            <el-tab-pane label="商品参数" name='1'>
              <!--渲染表单的item项  -->
              <el-form-item :label="item.attr_name" v-for="(item ) in manyTabData" :key="item.attr_id">
                <!-- 复选框组 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox  v-for="(item1,index) in item.attr_vals " :key="index" :label="item1" border></el-checkbox>
                                
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>

            <!-- tab 商品属性 -->
            <el-tab-pane label="商品属性" name='2'>
              <el-form-item :label="item.attr_name" v-for="(item) in onlyTabData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>

            <!-- tab 商品图片 -->
            <el-tab-pane label="商品图片" name='3'>
              <!-- action 图片上传的完整API地址  list-type 文件列表的类型 header 指定请求头 保证跨域 -->
              <el-upload  action="http://localhost:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerobj" :on-success="handleSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>


            <el-tab-pane label="商品内容" name='4'>
              <!-- 富文本编辑器 -->
              <!-- <quill-editor ref="myQuillEditor" v-model="addForm.goods_introduce" /> -->
                <!-- 添加商品按钮 -->
                <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
            </el-tab-pane>
                    
          </el-tabs>
      </el-form>
    </el-card >


    <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
             <img :src="previewPath" /> 
        </el-dialog>
  </div>
</template>

<script>
export default {  
  name:'addGoods',
  data() {
    return {
      active:0,
      activeIndex:'0',
      // 添加商品信息表单
      addForm:{
        goods_name:'',
        goods_price:'',
        goods_weight:'',
        goods_number:'',
        goods_cat:'',
      },
      //  验证表单
      addFormRules:{
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },    
        ],
        goods_price: [
              { required: true, message: '请选择商品重量', trigger: 'change' }
        ],
        goods_weight: [
              { required: true, message: '请选择商品重量', trigger: 'change' }
        ],
        goods_number: [
              { required: true, message: '请选择商品重量', trigger: 'change' }
        ],
        goods_cat: [
              { required: true, message: '请选择商品参数', trigger: 'change' }
        ]
      },
      // 商品分类列表
      cateList:[],
      // 级联选择框配置
      cateProps:{
        // 次级菜单的展开方式
        expandTrigger: 'hover',
        // 指定选项标签为选项对象的某个属性值
        label:'cat_name',
        // 指定选项的值为选项对象的某个属性值
        value:'cat_id',
        // 指定选项的子选项为选项对象的某个属性值 
        children:'children'
      },
      // 获取的动态参数列表数据
      manyTabData:[],
      // 获取的静态属性列表数据
      onlyTabData:[],
      // 设置上传的请求头
      headerobj:{
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath:'',
      //   图片预览装口的显示和隐藏 
      dialogVisible:false
    }
  },
  computed:{
    cateId(){
      if(this.addForm.goods_cat.length == 3){
          return this.addForm.goods_cat[2]
      }else{
          return null
      }
    }
  },
  mounted() {
    this.getCateList()
  },
  methods: {
    handlechange(){
        if(this.addForm.goods_cat.length != 3){
                this.addForm.goods_cat = []
        }else{

        }
    },
    getCateList(){
      this.$require.get('categories',{params:{
        type:3
      }}
    ).then(res=>{
      console.log(res);
      this.cateList = res.data.data
    })
      
    },
    // tab标签切换的组织和允许函数
    beforeTabLeave(activeName,oldActiveLName){
      if(oldActiveLName == '0' && this.addForm.goods_cat.length !=3){
          this.$message.error('请先选择商品分类')
          return false
      }
    },
    // tab栏切换函数
    async tabClick(){
     //证明访问的是动态参数面板
      if(this.activeIndex =='1'){
          const {data:res} = await this.$require.get(`categories/${this.cateId}/attributes`,{
                params:{ sel:'many' }
          })
          if(res.meta.status !=200){
            return this.$message.error('获取动态参数列表失败')
          }else{
              console.log(res.data);
              res.data.forEach(item =>{
              item.attr_vals= item.attr_vals.length ==0 ? []:item.attr_vals.split(' ')
          })
          this.manyTabData = res.data
        } 
      } 
      // 证明访问的是静态属性的面板
      else if(this.activeIndex =='2'){
        const {data:res} = await this.$require.get(`categories/${this.cateId}/attributes`,{
            params:{ sel:'only' }
        })
        if(res.meta.status !=200){
          return this.$message.error('获取动态参数列表失败')
        }else{
           // console.log(res.data);
            // 这里不需要将attr_vals转换为数组
            // res.data.forEach(item =>{
            //     item.attr_vals= item.attr_vals.length ==0 ? []:item.attr_vals.split(' ')
            // })
            this.onlyTabData = res.data
        }
      }
    },
    // 处理图片预览效果
    handlePreview(file){
      console.log(file);
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    handleRemove(file){
      //  1、获取将要删除的图片的临时路径
            const filePath = file.response.data.temp_path
            // 2、从pics数组中找到对片对应的索引值
            const index = this.addForm.pics.findIndex(x=>{
                    x.pic ==filePath
                })
            // 3、调用数组splice方法，把图片信息从pics中删除
            this.addForm.pics.splice(index,1)
    },
    handleSuccess(response){
       console.log(response);
            // 1、先拼接的得到一个图片信息对象
            const picInfo = {pic:response.data.tmp_path }
            // 2、将图片信息对象push到pics数组中
            this.addForm.pics.push(picInfo)
            console.log(this.addForm);
    },
    // 添加商品
    add(){  
      this.$refs.addFormRef.validate( async valid=>{
        if(!valid){
          return this.$message.error('请添加必要的表单项')
        }else{
        //1、 接口文档中需要提交字符串对象，所以能能将数组对象转换为字符串对象，因为级联选择器中v-model只能绑定数组对象，所以不能直接将goods_cat转换为字符串对象，先进行深拷贝 对拷贝对象操作 （需要安装依赖 lodash）
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
        // 2、处理动态参数和静态属性 ，使其符合接口文档中的attrs
          this.manyTabData.forEach(item=>{
            const newInfo ={
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(' ')
            }
              this.addForm.attrs.push(newInfo)
          })
          this.onlyTabData.forEach(item=>{
              const newInfo={
                attr_id : item.attr_id,
                attr_value :item.attr_vals
              }
              this.addForm.attrs.push(newInfo)
          })
          // 3、将符合插口文档的attrs 传入form中
          form.attrs = this.addForm.attrs
          // 4、提交表单
          // 商品名称必须是唯一的
          const {data:res} = await this.$require.post('goods' , form)
          console.log(res);
          if(res.meta.status !=201){
              return this.$message.error('提交商品失败')
          }else{
              this.$message.success('提交商品成功')
              this.$router.push('/goods')
          }
        }
    })
  }
      
  }
}
</script>

<style scope>
.el-cascader-panel {
  height: 300px;
}
.el-dialog img {
     width: 100%;
}
.addBtn {
     margin-top:15px ;
}
.el-card {
    margin-top: 20px;
}
</style>