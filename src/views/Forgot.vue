<template>
  <div class="forgot">
    <div class="mask"></div>
    <div class="content">
      <van-nav-bar title="找回密码" left-text="返回" left-arrow @click-left="back" />
      <div class="forgot-box">
        <div v-if="!isNext">
          <van-form>
            <van-field type="text" label="邮箱" placeholder="邮箱地址" v-model="email" />
            <!-- key: 防止当前表单域会将内容携带给其他表单域 -->
            <van-field key="code" type="text" label="验证码" placeholder="6位验证码" v-model="validCode">
              <template #button>
                <van-button size="small" type="info" :disabled="isSend" @click="getCode">{{text}}</van-button>
              </template>
            </van-field>
            <div class="register-btn">
              <van-button round block type="info" native-type="submit" @click="next">下一步</van-button>
            </div>
          </van-form>
        </div>

        <div v-else>
          <van-form>
            <van-field
              type="text"
              label="手机号"
              placeholder="注册时手机号"
              left-icon="phone-o"
              maxlength="11"
              v-model="userData.phone"
            />
            <van-field
              :type="isEye ? 'text' : 'password'"
              label="新密码"
              placeholder="字母数字_组合(6-16位)"
              left-icon="lock"
              :right-icon="isEye ? 'eye-o' : 'closed-eye'"
              @click-right-icon="taggeEye"
              maxlength="16"
              v-model="userData.password"
            />
            <div class="register-btn">
              <van-button round block type="info" native-type="submit" @click="retrievePassword">提交</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/forgot.less";
export default {
  data() {
    return {
      isNext: true,
      isSend: false,
      text: "获取验证码",
      isEye: false,
      email: "",
      validCode: "",
      userData: {
        phone: "",
        password: ""
      }
    };
  },
  created() {},
  methods: {
    back() {
      this.$router.go(-1);
    },
    //切换密码显示隐藏
    taggeEye() {
      this.isEye = !this.isEye;
    },
    // 获取验证码
    getCode() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data: {
          appkey: this.appkey,
          email: this.email
        }
      })
        .then(result => {
          this.$toast.clear();
          
          this.$toast(result.data.msg);
          if (result.data.code == "J001") {
            let time = 60;
            this.text = time + "秒后重新发送";
            this.isSend = true;
            let timer = setInterval(() => {
              if (time == 0) {
                clearInterval(timer);
                this.text = "获取验证码";
                this.isSend = false;
              } else {
                time--;
                this.text = time + "秒后重新发送";
              }
            }, 1000);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 下一步
    next() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/checkValidCode",
        data: {
          appkey: this.appkey,
          validCode: this.validCode
        }
      })
        .then(result => {
          this.$toast.clear();
          
          this.$toast(result.data.msg);
          if (result.data.code == "K001") {
            this.isNext = true;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 修改密码
    retrievePassword() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/retrievePassword",
        data: {
          appkey: this.appkey,
          phone: this.userData.phone,
          password:this.userData.password
        }
      })
        .then(result => {
          this.$toast.clear();
          
          this.$toast(result.data.msg);
          if(result.data.code=='L001'){
            setTimeout(() => {
              this.$router.push({name:'Login'})  
            }, 1000);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
</style>