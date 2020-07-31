<template>
  <div class="register">
      <div class="mask"></div>
      <div class="content">
        <van-nav-bar
          left-text="登录"
          right-text="关闭"
          left-arrow
          @click-left="goLogin"
          @click-right='goHome'
        />

        <div class="logo">
          <img src="../assets/images/logo.png">
        </div>

        <van-form>
          <van-field
            v-model="nickName"
            label="昵称"
            placeholder="昵称"
            left-icon="user-o"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
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
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click='register'>
              注册
            </van-button>
          </div>
        </van-form>
      </div>
  </div>
</template>

<script>
import '../assets/css/register.less'
  export default {
    data(){
      return{
        nickName:'',
        password:'',
        phone:'',
        isShow:false
      }
    },
    methods:{
      // 切换密码显示隐藏
      taggeEye(){
        this.isShow=!this.isShow
      },
      // 注册
      register(){
        this.$toast.loading({
          message:'加载中...',
          forbidClick:true,
          duration:0
        })

        this.axios({
          method:'POST',
          url:'/register',
          data:{
            appkey:this.appkey,
            nickName:this.nickName,
            password:this.password,
            phone:this.phone
          }
        }).then(result=>{
          this.$toast.clear();
          
          this.$toast(result.data.msg)
          this.$router.push({name:'Login'})
        }).catch(err=>{
          this.$toast.clear();
          this.$toast(result.data.msg)
          
        })
      },
      //跳转登录页面
      goLogin(){
        this.$router.push({name:'Login'})
      },
      //跳转主页面
      goHome(){
        this.$router.push({name:'Home'})
      }
    }
  }
</script>

<style lang="less" scoped>

</style>