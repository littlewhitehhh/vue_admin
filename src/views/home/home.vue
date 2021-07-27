<template>
    <div class="home">
     <el-container>
       <!-- 头部 -->
        <el-header>
          <!-- logo模块 -->
          <div class="logo">
            <img src="../../assets/Images/login/404notfound.png" alt="">
            <span>后台管理系统</span>
          </div>
          <!-- 菜单模块 -->
          <div class="menu">
            <el-menu
              mode="horizontal"   
              class="el-menu-demo"
              background-color="#33c3ce"
              text-color="#fff"
              active-text-color="skyblue">
                <el-menu-item index="1">
                  登陆人的信息
                </el-menu-item>
                <el-menu-item index="2" @click="SignOut">退出</el-menu-item>
            </el-menu>
          </div>
        </el-header>
        <el-container>
          <!-- 左边框 -->
          <el-aside :width="isWider?'199px':'64px'">
            <!-- 用来实现侧边栏切换的按钮 -->
            <div class="aside-btn" @click="changeWidth">|||</div>
            <!-- 侧边导航栏 -->
             <el-menu   
                router
                class="el-menu-vertical-demo"
                :default-active="activePath"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                :unique-opened='true' 
                :collapse = "!isWider"
                :collapse-transition = "false" >
                  <el-submenu :index="item.id + ''" v-for="(item,id) in menuLists" :key='id'>
                    <template slot="title">
                      <i :class="iconLists[item.order-1]"></i>
                      <span>{{item.authName}}</span>  
                    </template>
                    <el-menu-item  :index = "'/' +objitem.path" v-for="(objitem,objid) in item.children" :key="objid"  @click = "saveNavStats('/'+item.path)">{{objitem.authName}}</el-menu-item>
                </el-submenu>
                
              </el-menu>
          </el-aside>
          <!-- 主体部分 -->
          <el-main>
            <router-view></router-view>
          </el-main>

        </el-container>
      </el-container>
    </div>
</template>

<script>
export default {
  name:'Home',
  data() {
    return {
      // 左侧列表数据
      menuLists:[],
      // 菜单放缩
      isWider:true,
      // 字体图标数数组
      iconLists:[
        'el-icon-user-solid',
        'el-icon-lock',
        'el-icon-s-goods',
        'el-icon-s-order',
        'el-icon-s-marketing'

      ],
      
      // 保证页面刷新后导航栏所显示项依旧高亮
      //被激活的链接地址
        activePath:'',
      
    }
  },
  created() {
    this.getMenuList();
    // 读取高亮的地址
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出登录
    SignOut(){
      this.$router.push('/login')
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('activePath')
    },
    //改变侧边栏宽度
    changeWidth(){
      this.isWider = ! this.isWider
      console.log(this.isWider);
    },
    /* handleOpen(key, keyPath) {
        console.log('handleOpen',key, keyPath);
      },
    handleClose(key, keyPath) {
        console.log('handleClose',key, keyPath);
    },
 */
    // 获取数据
    getMenuList(){
      this.$require.get('menus')
        .then(res=>{
          // console.log(res);
          this.menuLists = res.data.data
        }).catch(err=>{
          // console.log(err);
        })
    },

    // //保存连接的激活状态
    saveNavStats(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      //点击不同链接时候，给cativePath赋值 ，实现高亮效果的动态切换
      this.activePath = activePath
    } 
  },
}
</script>

<style scoped>
.home{
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #33c3ce;
  height: 60px;
  line-height: 60px;
}
.logo{
  height: 100%;
  display: flex;
  line-height: 60px;
  color: white;
  font-size: 20px;
}
.logo img {
  height:100%;
  border-radius: 50%;
  overflow: hidden;
  margin-right:20px  ; 
}
.el-container{
  background-color: #f3f3f3;
  height: 100%;
}
.el-aside{
  background-color: #545c64;
}
.aside-btn {
  margin: 10px 0;
  text-align: center;
  color: #fff; 
  cursor: pointer;
}
</style>