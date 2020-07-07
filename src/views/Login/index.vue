<template>
    <div id="login">                   
        <div class="login-wrap">
            <ul class="menu-tab">
                <li :class="{'current': item.flag}" v-for="item in menuTab" :key="item.txt" @click="toggleMenu(item)">{{item.txt}}</li>
            </ul>
            <!--表单-->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form" size="medium">
                <el-form-item prop="username" class="item-form">
                    <label>邮箱</label>
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="password"  class="item-form">
                    <label>密码</label>
                    <el-input type="text" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
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
                            <el-button type="success" class="block" @click="getSms()">获取验证码</el-button>
                        </el-col>
                    </el-row>                   
                </el-form-item>
                <el-form-item>
                    <el-button 
                    type="danger" 
                    @click="submitForm('ruleForm')" 
                    class="login-btn block"
                    :disabled="loginButtonStatus">{{model === "login" ? "登录" : "注册"}}</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import {stripscript,validateEmail,validateMyPassword,validateMyCode} from '../../utils/validate.js'
import {reactive,ref,onMounted} from '@vue/composition-api'
import {GetSms} from '../../api/login.js'
export default {
    name: 'login',
    components: {},
    setup(props, {refs,root}){
        //模块值
        const model = ref('login')
        //登录按钮禁用状态
        const loginButtonStatus = ref(true)
        //表单绑定数据
        const ruleForm= reactive({
          username: '',
          password: '',
          passwords: '',
          code: ''
        })
        //这里放置data数据，生命周期，自定义的函数
        const menuTab = reactive([
            {txt: '登录',flag: true,type: 'login'},
            {txt: '注册',flag: false,type: 'register'}
        ])
        //验证用户名为邮箱
      let validateUsername = (rule, value, callback) => {
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
      let validatePassword = (rule, value, callback) => {
          //过滤后得数据
          ruleForm.password = stripscript(value)
          value = ruleForm.password
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
      let validatePasswords = (rule, value, callback) => {
          //如果模块值为login，直接通过
          if(model.value === 'login'){callback()}
          //过滤后得数据
          ruleForm.passwords = stripscript(value)
          value = ruleForm.passwords
        // let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != ruleForm.password) {
          callback(new Error('重复密码不正确'));
        } else {
          callback();
        }
      };
    //验证验证码 字母或数字6位
      let validateCode = (rule, value, callback) => {
        //过滤后得数据
          ruleForm.code = stripscript(value)
          value = ruleForm.code
        // let reg = /^[a-z0-9]{6}$/
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else if (validateMyCode(value)) {
          callback(new Error('验证码格式不正确（字母或数字6位）'));
        } else {
          callback();
        }
      };
        //表单的验证
        const rules= reactive({
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
        })
        //声明函数
        const toggleMenu = (data => {
            // debugger;
            menuTab.forEach(elem => {
                elem.flag=false
            })
            data.flag = true
            model.value = data.type
            console.log(model.value)
        })
        //获取验证码
        const getSms = (() => {
          if(ruleForm.username == ''){
            root.$message({
              message: '邮箱不能为空!!!',
              type: 'error',
              duration: 1000
            })
            return false
          }
          if(validateEmail(ruleForm.username)){
            root.$message({
              message: '邮箱格式有误!!!',
              type: 'error',
              duration: 1000
            })
            return false
          }
          let data = {
            username: ruleForm.username
          }
          GetSms(data).then(response => {
            console.log(response)
          }).catch(error => {
            console.log(error)
          })
        })
        //表单方法
        const submitForm = (formName => {

            refs[formName].validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        })

        //生命周期
        onMounted(() => {

        })

        return{
            menuTab,
            ruleForm,
            rules,
            model,
            loginButtonStatus,
            submitForm,
            toggleMenu,
            getSms,
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