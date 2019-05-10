<template>
  <div class="logincontent">
    <header class="login-head">
      <img src="../../assets/image/logo.png" alt="">
    </header>
    <div class="login-page">
      <div class="login-pic">
        <img src="../../assets/image/loginbanner.jpg" alt="">
      </div>
      <div class="login-box animated fadeIndown">

        <div class="login-info">
          <h4>登录管理系统</h4>
          <!--<p>Login in. To see it in action.</p>-->
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="userName" class="login-list">
            <span class="iconbox"><em class="base-icon headicon"></em></span>
            <input v-model.trim="loginForm.userName" placeholder="管理员账号">
          </el-form-item>
          <el-form-item prop="password" class="login-list">
            <span class="iconbox"><em class="base-icon lockicon"></em></span>
            <input type="password" placeholder="密码" v-model.trim="loginForm.password" @keyup.enter="submitForm('loginForm')">
          </el-form-item>
          <el-form-item class="login-list special">
            <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登录</el-button>
          </el-form-item>
          <!--<div class="login-linkbox">-->
          <!--<a class="login-link" @click="changelink(0)">注册</a>-->
          <!--<a class="login-link" @click="changelink(1)">找回密码</a>-->
          <!--</div>-->
        </el-form>
      </div>
    </div>
    <footer class="login-foot">

    </footer>
  </div>
</template>

<script>
  import {baseUrl} from '@/config/env';
  import {setStore,getStore} from '@/config/mUtils';
  import {mapActions, mapState} from 'vuex'
  import {loginfun} from '@/api/getData'
  import axios from 'axios'
  export default {
    name: 'login',
    data () {
      return {
        baseUrl,
        useinfo:'',
        isReadOnly: false,
        loginForm: {
          userName: '',
          password: '',
        },
        rules: {
          username: [
            { required: true, message: '请输入管理员账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
        },
        showLogin: false,
      }
    },
    mounted(){
      this.getAdmintoken();
      this.getAdminData();
      console.log(this.admin_token,this.adminInfo)
      if (this.login_token){
        this.getAdminData();
      }else{
      }
    },
    computed: {
      ...mapState(['admin_token','adminInfo']),
    },
    methods: {
      ...mapActions(['getAdmintoken','getAdminData']),

      changelink(index){
        if(index==0){
          this.$router.push('register')
        }else{
          this.$router.push('forget')
        }
      },
      async submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await loginfun(this.loginForm);
            if(res.code===0){
              setStore("login_token",res.data.userId);
              setStore("phone",res.data.phone);
              this.getAdmintoken();
              // axios.defaults.params['login_token'] = getStore('login_token');
              this.$router.push('/home')
            }else{
              this.$message({
                type: 'error',
                message: '抱歉，您输入的账号密码有误'
              });
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '请输入正确的用户名密码',
              offset: 100
            });
            return false;
          }
        });
      },
      gohomepage(){
        this.$router.push('/home')
      },
    },
    watch: {
      adminInfo: function (newValue,oldVal){
        if (this.adminInfo.isok) {
          this.$message({
            type: 'success',
            message: '检测到您之前登录过，将自动登录'
          });
          this.gohomepage();
        }
      }
    }
  }
</script>
<style scoped>
  .logincontent{width:100%;background: url(../../assets/image/loginbg.png);}
  .login-head{height:180px;width:1024px;margin:0 auto;}
  .login-head img{margin:45px 0 46px 0;}
  .login-page{height:650px;position: relative;background:#000;width:100%;}
  .login-info h4{text-align: center;color:#fff;font-size:35px;line-height:120%;height:76px;}

  .login-pic,.login-box{position: absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:100;height:650px;}
  .login-box{height:330px;margin-left: 297px;width:380px;padding:85px 25px;}
  .login-list{width:100%;height:60px;line-height:60px;border-radius:4px;overflow: hidden;background: #fff;margin-top:20px;}
  .login-list.special{background: transparent;}
  .login-list span.iconbox{display: block;width:50px;height:60px;float:left;}
  .base-icon{background: url(../../assets/image/adminicon.png) no-repeat;display:inline-block;vertical-align: middle;}
  .headicon,.lockicon,.rdicon{width:50px;height:60px;background-position:-0px 0;}
  .lockicon{background-position:-50px 0;}
  .login-list input,.login-list .el-input{width:220px;float:left;line-height:60px;height:60px;padding:0 13px 0 0;font-size:20px;color:#6c6c6c;}
  .login-list .submit_btn{display: block;width:100%;height:60px;text-align: center;background:rgba(243,152,0,.95);color:#fff;font-size:18px;cursor: pointer;border:none;border-radius: 30px;}
  .login-list .submit_btn:hover{background:rgba(243,152,0,.8);}
  .login-foot{height:180px;}

  @media screen and (max-width: 1600px) {
    .login-head{height:120px;width:900px;margin:0 auto;}
    .login-head img{margin:30px 0 30px 0;width:266px;}
    .login-page,.login-pic{height:450px;}
    .login-pic img{height:450px;width:1330px;}
    .login-box{transform: scale(0.69);top:0;margin:-20px 0 0 -9px;left:50%;}
  }

</style>
