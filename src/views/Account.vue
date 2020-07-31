<template>
  <div class="account">
    <van-nav-bar title="账户管理" left-text="返回" left-arrow @click-left="back" />

    <van-cell-group>
      <van-cell class="v-cell" title="头像">
        <div class="clearfix">
          <div class="user-img fr">
            <img class="auto-img" :src="userInfo.userImg" />
            <van-uploader class="uploader" :max-size="maxSize" :after-read="afterRead" />
          </div>
        </div>
      </van-cell>
      <van-cell class="v-cell" title="用户ID" :value="userInfo.userId" />
      <van-cell class="v-cell" title="手机号" :value="userInfo.phone" />
      <van-cell class="v-cell" title="昵称">
        <div class="clearfix">
          <div class="fr">
            <van-field @blur="modifyUserInfo({key:'nickName',value: userInfo.nickName, url: '/updateNickName'})" v-model="userInfo.nickName" input-align="right" />
          </div>
        </div>
      </van-cell>
      <van-cell class="v-cell" title="简介">
        <van-field
          v-model="userInfo.desc"
          @change="modifyUserInfo({key: 'desc', value: userInfo.desc, url: '/updateDesc'})"
          input-align="right"
          rows="2"
          autosize
          type="textarea"
          maxlength="20"
        />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import "../assets/css/account.less";
export default {
  data() {
    return {
      maxSize: 1 * 1024 * 1024,
      userInfo: {}
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    // 返回
    back() {
      this.$router.go(-1);
    },

    //上传头像
    afterRead(file) {
      //获取图片base64
      let serverBase64Img = file.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );
      
      let imgType = file.file.type.split("/")[1];
      let tokenString = localStorage.getItem("__TK");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "H001") {
            this.userInfo.userImg = result.data.userImg;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 获取用户数据
    getUserInfo() {
      let tokenString = localStorage.getItem("__TK");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "B001") {
            let userInfo = {
              desc: "",
              nickName: "",
              userBg: "",
              userImg: "",
              vip: "",
              userId: "",
              phone: ""
            };
            for (let key in userInfo) {
              userInfo[key] = result.data.result[0][key];
            }
            
            this.userInfo = userInfo;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //修改昵称，简介
    modifyUserInfo(o){
      let tokenString = localStorage.getItem("__TK");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: o.url,
        data: {
          appkey: this.appkey,
          tokenString,
          [o.key]: o.value
        }
      }).then(result=>{
        this.$toast.clear()
        
      }).catch(err => {
        this.$toast.clear(); 
        
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>