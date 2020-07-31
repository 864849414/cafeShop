<template>
  <div class="login">
    <div class="mask"></div>
      <div class="content">
        <van-nav-bar
          left-text="注册"
          right-text="关闭"
          left-arrow
          @click-left="goRegister"
          @click-right="goHome"
        />

        <div class="logo">
          <img src="../assets/images/logo.png">
        </div>

        <van-form>

          <van-field
            v-model="phone"
            label="手机"
            placeholder="手机"
            left-icon="phone-o"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
            v-model="password"
            :type="isShow?'text':'password'"
            label="密码"
            placeholder="密码"
            left-icon='lock'
            :right-icon='isShow?"eye-o":"closed-eye"'
            @click-right-icon="taggeEye"
            :rules="[{ required: true, message: '请填写密码' }]"
          />

          <div class="forget clearfix">
            <span class="fr" @click="forgot">忘记密码？</span>
          </div>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="login" >
              登录
            </van-button>
          </div>
        </van-form>
      </div>  
  </div>
</template>

<script>
import '../assets/css/login.less'
  export default {
    data(){
      return{
        phone:'',
        password:'',
        isShow:false
      }
    },
    methods:{
      //切换密码显示隐藏
      taggeEye(){
        this.isShow=!this.isShow;
      },
      //跳转注册页面
      goRegister(){
        this.$router.push({name:'Register'})
      },
      // 登录
      login(){
        this.$toast.loading({
          message:'加载中...',
          forbidClick:true,
          duration:0
        })

        this.axios({
          method:'POST',
          url:'/login',
          data:{
            appkey:this.appkey,
            password:this.password,
            phone:this.phone
          }
        }).then(result=>{
          this.$toast.clear();
          this.$toast(result.data.msg)
          
          if(result.data.code==200){
            localStorage.setItem('__TK',result.data.token)
            this.$router.push({name:'Home'})
          }
        }).catch(err=>{
          this.$toast.clear();
          this.$toast(result.data.msg)
          
        })
      },
      //跳转主页面
      goHome(){
        this.$router.push({name:'Home'})
      },
      // 找回密码
      forgot(){
        this.$router.push({name:'Forgot'})
      }

    }
  }
</script>

<style lang="less" scoped>

</style>