<template>
  <div class="setUp">
    <van-nav-bar title="设置" left-text="返回" left-arrow @click-left="back" />
    <div class="list-box">
      <van-cell-group>
        <van-cell title="修改密码" is-link @click="isShow" />
        <van-cell title="注销账号" is-link @click="destroyAccount"/>
      </van-cell-group>
    </div>
    <div class="logout">
      <van-button :round="true" :block="true" type="danger" @click="logout">退出登录</van-button>
    </div>

    <van-popup v-model="show" position="bottom">
      <van-form >
        <van-field
          v-model="passwords.oldPassword"
          label="旧密码"
          placeholder="旧密码"
        />
        <van-field
          v-model="passwords.newPassword"
          type="text"
          label="新密码"
          placeholder="新密码"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="updatePassword">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
  
</template>

<script>
import '../assets/css/setUp.less'
  export default {
    data(){
      return{
        show:false,
        passwords:{
          oldPassword:'',
          newPassword:''
        }
      }
    },
    created(){

    },
    methods:{
      back(){
        this.$router.go(-1)
      },
      //显示修改密码栏
      isShow(){
        this.show = true
      },
      // 修改密码
      updatePassword(){
        let tokenString = localStorage.getItem("__TK");

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method:'POST',
          url:'/updatePassword',
          data:{
            appkey: this.appkey,
            tokenString,
            password:this.passwords.newPassword,
            oldPassword: this.passwords.oldPassword
          }
        }).then(result=>{
          this.$toast.clear();
          
          this.$toast(result.data.msg)
          if(result.data.code=='E001'){

            setTimeout(() => {
              localStorage.removeItem('__TK')
              this.$router.push({name:'Login'})
            }, 1000);
          }
         
        }).catch(err=>{
          this.$toast.clear();
          
        })
      },

      // 退出登录
      logout(){
        localStorage.removeItem('__TK'),
        this.$router.push({name:'Login'})
      },
      // 注销账号
      destroyAccount(){
        let tokenString = localStorage.getItem("__TK");

        
        this.$dialog.confirm({
          title: '是否注销账号',
          message: '一旦注销，数据无法恢复',
        })
          .then(() => {
            this.$toast.loading({
              message: "加载中...",
              forbidClick: true,
              duration: 0
            });

            this.axios({
              method:'POST',
              url:'/destroyAccount',
              data:{
                appkey: this.appkey,
                tokenString,
              }
            }).then(result=>{
              this.$toast.clear();
              
              this.$toast(result.data.msg)
              setTimeout(() => {
                localStorage.removeItem('__TK')
                this.$router.push({name:'Login'})
              }, 1000);
            
            }).catch(err=>{
              this.$toast.clear();
              
            })
          })
          .catch(() => {
            
          });

        
      }
    }
  }
</script>

<style lang="less" scoped>
  
</style>