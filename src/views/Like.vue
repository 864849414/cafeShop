<template>
  <div class="like">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="back"  />
    <div class="like-content">
      <div class="content-item fl clearfix" v-for="(item,index) in myLikeData" :key='index'>
        <div class="item-img">
          <img class="auto-img" :src="item.smallImg" @click="goDetail(item.pid)">
        </div>
        <div class="name fl">
          <div class="item-name">{{item.name}}</div>
          <div class="item-enname">{{item.enname}}</div>
        </div>
        <div class="price fl">
          ￥{{item.price}}
        </div>
        <div class="fl delete">
          <van-icon name="delete" @click="delLike(item.pid,index)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/css/like.less'
  export default {
    data(){
      return{
        myLikeData:[]
      }
    },
    created(){
      this.getMyLikeData()
    },
    methods:{
      back(){
        this.$router.go(-1)
      },

      // 获取收藏商品信息
      getMyLikeData(){
        let tokenString = localStorage.getItem("__TK");

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method: "GET",
          url: "/findAllLike",
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result=>{
          this.$toast.clear();
          
          if(result.data.code==2000){
            result.data.result.forEach(v=>{
              this.myLikeData.push(v)
            })
            
          }
        }).catch(err=>{
          this.$toast.clear();
          
        }) 
      },

      // 跳转到商品详细 并传pid
      goDetail(pid) {
        this.$router.push({ name: "Detail", query: { pid } });
      },

      //删除商品收藏
      delLike(pid,index){
        let tokenString = localStorage.getItem("__TK");

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method: "POST",
          url: "/notlike",
          data: {
            appkey: this.appkey,
            tokenString,
            pid
          }
        }).then(result=>{
          this.$toast.clear();
          
          if (result.data.code == 900) {
            this.myLikeData.splice(index, 1);
          }

        }).catch(err=>{
          this.$toast.clear();
          
        })
      }
    }  
  }
</script>

<style lang="less" scoped>

</style>