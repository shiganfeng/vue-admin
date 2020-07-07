<template>
    <div id="login">                   
        <div class="login-wrap">
            <ul class="menu-tab">
                <li :class="{'current': item.flag}" v-for="item in menuTab" :key="item.txt" @click="toggleMenu(item)">{{item.txt}}</li>
            </ul>
            <!--表单-->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="login-form" size="medium">
                <el-form-item prop="username" class="item-form">
                    <label for="username">邮箱</label>
                    <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password"  class="item-form">
                    <label for="password">密码</label>
                    <el-input id="password" type="text" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="passwords"  class="item-form" v-show="model === 'register'">
                    <label>重复密码</label>
                    <el-input type="text" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item prop="code" class="item-form">
                    <label>验证码</label>
                    <el-row :gutter="10">
                        <el-col :span="15">
                            <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block" @click="getSms()" 
                            :disabled="codeButtonStatus.status">{{codeButtonStatus.text}}</el-button>
                        </el-col>
                    </el-row>
                    
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" 
                    @click="submitForm('loginForm')" 
                    class="login-btn block"
                    :disabled="loginButtonStatus">{{model == 'login' ? '登录' : '注册'}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {stripscript,validateEmail,validateMyPassword,validateMyCode} from '../../utils/validate.js'
import {GetSms, Register, Login} from '../../api/login.js'
export default {
    name: 'login',
    components: {},
    data() {
      //验证用户名为邮箱
      var validateUsername = (rule, value, callback) => {
        // let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (value === '') {
            callback(new Error('请输入用户名'));
        }else if(validateEmail(value)){
            callback(new Error('用户名格式有误'));
        } else {
        //   if (this.ruleForm.username !== '') {
        //     this.$refs.ruleForm.validateField('username');
        //   }
          callback();//返回true
          
        }
      };
      //验证密码字母+数字6-20位
      var validatePassword = (rule, value, callback) => {
          //过滤后得数据
          this.ruleForm.password = stripscript(value)
          value = this.ruleForm.password
        // let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (validateMyPassword(value)) {
          callback(new Error('密码格式不正确（字母+数字6-20位）'));
        } else {
          callback();
        }
      };
    //验证重复密码字母+数字6-20位
      var validatePasswords = (rule, value, callback) => {
          //如果模块值为login，直接通过
          if(this.model === 'login'){callback()}
          //过滤后得数据
          this.ruleForm.passwords = stripscript(value)
          value = this.ruleForm.passwords
        // let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != this.ruleForm.password) {
          callback(new Error('重复密码不正确'));
        } else {
          callback();
        }
      };
    //验证验证码 字母或数字6位
      var validateCode = (rule, value, callback) => {
        //过滤后得数据
          this.ruleForm.code = stripscript(value)
          value = this.ruleForm.code
        // let reg = /^[a-z0-9]{6}$/
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else if (validateMyCode(value)) {
          callback(new Error('验证码格式不正确（字母或数字6位）'));
        } else {
          callback();
        }
      };
      return {
        menuTab: [
                {txt: '登录',flag: true,type: 'login'},
                {txt: '注册',flag: false,type: 'register'}
            ],
        //模块值
        model: 'login',
        loginButtonStatus: false,
        codeButtonStatus: {
          status: false,
          text: '获取验证码'
        },
        timer: null,
        codeButtonText: '获取验证码',
            //表单数据
        ruleForm: {
          username: '',
          password: '',
          passwords: '',
          code: ''
        },
        rules: {
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          passwords: [
            { validator: validatePasswords, trigger: 'blur' }
          ],
          code: [
            { validator: validateCode, trigger: 'blur' }
          ]
        }
      };
    },
    created(){},
    mounted(){},
    methods: {
        toggleMenu(data){
            // for(var i =0;i<this.menuTab.length;i++){
            //     this.menuTab[i].flag=false
            // }
            this.clearCountDown()
            this.menuTab.forEach(elem => {
                elem.flag=false
            })
            data.flag = true
            this.model = data.type
            //重置表单
            this.$refs['loginForm'].resetFields()
            console.log(this.model)
        },
        //获取验证码
        getSms(){
          if(this.ruleForm.username == ''){
            this.$message({
              message: '邮箱不能为空!!!',
              type: 'error',
              duration: 1000
            })
            return false
          }
          if(validateEmail(this.ruleForm.username)){
            this.$message({
              message: '邮箱格式有误!!!',
              type: 'error',
              duration: 1000
            })
            return false
          }
          let requestData = {
            username: this.ruleForm.username,
            module: this.model
          }
          this.codeButtonStatus.status = true
          this.codeButtonStatus.text = '发送中'
          setTimeout(() => {
            //获取验证码
            GetSms(requestData).then(response => {
              let data = response.data
              this.$message({
                message: data.message,
                type: 'success',
                duration: 1000
              })
              console.log(data.message)
              //启用登录或注册按钮
              this.loginButtonStatus = false
              //倒计时
              this.countDown(3)
            }).catch(error => {
              console.log(error)
            })
          },2000)
        },
        //倒计时
        countDown(number){
          //判断定时器是否存在，存在就清除
          if(this.timer){
            clearInterval(this.timer)
          }
          let time = number
          this.timer = setInterval(()=> {
            time--
            if(time == 0){
              clearInterval(this.timer)
              this.codeButtonStatus.status = false
              this.codeButtonStatus.text = '重新获取'
            }else{
              this.codeButtonStatus.text = `倒计时${time}秒`
            }
          },1000)
        },
        //清除倒计时
        clearCountDown(){
          this.codeButtonStatus.status = false
          this.codeButtonStatus.text = '获取验证码'
          clearInterval(this.timer)
        },
        //登录
        login(){
            let requestData = {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            code: this.ruleForm.code
          }
          //登录接口
          Login(requestData).then((response) => {
            let data = response.data
            this.$message({
              message: data.message,
              type: 'success',
              duration: 1000
            })
            //页面跳转
            this.$router.push({
              name: 'Console'
            })
            console.log(data)
          }).catch((error) => {
            this.$message({
              message: error.message,
              type: 'error',
              duration: 1000
            })
          })
        },
        //注册
        register(){
            let requestData = {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            code: this.ruleForm.code
          }
          //注册接口
          Register(requestData).then((response) => {
            let data = response.data
            this.$message({
              message: data.message,
              type: 'success',
              duration: 1000
            })
            this.toggleMenu(this.menuTab[0])
            this.clearCountDown()
            console.log(data)
          }).catch((error) => {
            console.log(error)
            this.$message({
              message: error.message,
              type: 'error',
              duration: 1000
            })
          })
        },
        //表单方法
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
              this.model == 'login' ? this.login() : this.register()
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        }
    }
}
</script>
<style scoped lang="scss">
#login{
    background-color: #1D3B5F;
    height: 100vh;
}
.login-wrap{
    width: 330px;
    margin: auto;
    .login-form{
        margin-top: 29px;
        label{
            margin-bottom: 3px;
            display: block;
            font-size: 14px;
            color: #fff;
        }
        .item-form{
            margin-bottom: 13px;
        }
        .block{
            display: block;
            width: 100%;
        }
        .login-btn{
            margin-top: 19px;
        }
    }
}
.menu-tab{
    text-align: center;
    li{
        display: inline-block;
        width: 88px;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        border-radius: 2px;
        color: #ffffff;
        cursor: pointer;
    }
    .current{
        background-color: rgba(0,0,0,.1);
    }
}
</style>