<template>
  <div class="my">
    <div class="my-content">
      <div class="my-top" :style="{backgroundImage:'url('+ userInfo.userBg +')'}">
        <div class="bg fr">
          <div>更换背景</div>
          <van-uploader class="bgUploader" :max-size="maxSize" :after-read="afterRead" />
        </div>
        <div class="user-img">
          <img class="auto-img" :src="userInfo.userImg" alt />
        </div>
        <div class="user-name">{{userInfo.nickName}}</div>
        <div class="user-desc">简介：{{userInfo.desc==""?"这个人很懒，什么也没留下":userInfo.desc}}</div>
      </div>

      <div class="my-center">
        <van-cell-group>
          <van-cell
            :title="item.title"
            is-link
            :icon="item.icon"
            v-for="(item,index) in listData"
            :key="index"
            @click="goPage(item.name)"
          />
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/my.less";
export default {
  data() {
    return {
      maxSize: 1 * 1024 * 1024,
      userInfo: {},
      listData: [
        { title: "账号管理", icon: "user-o", name: "Account" },
        { title: "地址管理", icon: "home-o", name: "MyAddress" },
        { title: "我的收藏", icon: "star-o", name: "Like" },
        { title: "设置", icon: "setting-o", name: "SetUp" }
      ]
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    // 跳转
    goPage(name) {
      this.$router.push({ name });
    },
    // 获取用户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("__TK");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "A001") {
            let userInfo = {
              desc: "",
              nickName: "",
              userBg: "",
              userImg: "",
              vip: ""
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
    //上传图片
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
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img
        }
      })
        .then(result => {
          this.$toast.clear();
					
					if(result.data.code=='I001'){
						this.userInfo.userBg = result.data.userBg;
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