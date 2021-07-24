<template>
    <div class="login_box">
      <div class=""></div>
      <div class="form_box">
        <el-form label-width="75px"
                 :model="loginForm"  
                 ref="loginFormRef" 
                 :rule="loginRules">
          <el-form-item label="账号" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="SignIn">登录</el-button>
            <el-button >重置</el-button>
          </el-form-item>
      </el-form>
      </div>
      
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 登陆表单数据
      loginForm:{
        username:'admin',
        password:'123456'
      },
      // 表单验证规则
      loginRules: {
       username:[
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 1,  message: '长度不小于1个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 8, max: 16, message: '长度在 8到16个字符之间', trigger: 'blur' }
        ]
      },
    }
  },
  mounted() {
    console.log(this);
  },
  methods: {
    // 用户登录
    SignIn(){
      // console.log(this);
      // if(this.loginForm){
        this.$require.post('/login',this.loginForm)
          .then(res=>{
          // console.log(res);
          if(res.data.meta.status ==200){
            // alert(res.data.meta.msg)
          //  console.log(res.data.data);
           window.sessionStorage.setItem('token',res.data.data.token)
            this.$router.push('/home')
          }else{
            alert(res.data.meta.msg)
          }
        }).catch(err=>{
          console.log(err);
        })
      /* }else{
        alert('请输入内容')
      } */
      
    }
  },

}
</script>

<style scoped>
  
  .login_box{
    height: 100%;
   background-color: skyblue;
  }
  .form_box{
    position: absolute;
    width: 500px;
    height: 250px;
    border-radius:25px ;
    background-color:deepskyblue ;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    
  }
  .el-form{
    margin-top: 50px;
  }
  .el-input{
    width: 90%;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .btns button {
     margin-right:45px ;
  }
</style>