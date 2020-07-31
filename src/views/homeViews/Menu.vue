<template>
  <div class="menu">
    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item,index) in bannerData" :key="index">
        <img :src="item.bannerImg" class="auto-img" />
      </van-swipe-item>
    </van-swipe>

    <div class="menu-content">
      <div class="menu-nav clearfix">
        <div
          class="nav-item fl"
          v-for="(item,index) in typeData"
          :key="index"
          @click="toggleItem(item,index)"
        >
          <div class="item" :class="{active:item.isActive}">
            <i class="icon iconfont" :class="typeIcon[index].icon"></i>
          </div>
          <span>{{item.typeDesc}}</span>
        </div>
      </div>

      <div class="content clearfix">
        <div class="item fl" v-for="(item,index) in productData" :key="index">
          <div class="item-img" @click="goDetail(item.pid)">
            <img class="auto-img" :src="item.smallImg" />
          </div>
          <div class="item-info clearfix">
            <div class="item-name fl">
              <div class="name">{{item.name}}</div>
              <div class="enname">{{item.enname}}</div>
            </div>
            <div class="price fr">￥{{item.price}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/menu.less";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("menuModule");
export default {
  data() {
    return {
      value: "",
      //商品类型
      typeData: [],
      // bannertu
      bannerData: [],
      // 商品数据
      productData: [],
      //商品类型图标
      typeIcon: [
        {
          icon: "icon-tuijian"
        },
        {
          icon: "icon-ziyuan"
        },
        {
          icon: "icon-kafei"
        },
        {
          icon: "icon-kafei1"
        }
      ]
    };
  },
  created() {
    this.getTypeData();
    this.getBannerData();
    
  },
  computed: {
    ...mapState(["bannerDataCache", "products"])
  },
  methods: {
    toggleItem(item, index) {
      if (item.isActive) {
        return;
      }
      for (let i = 0; i < this.typeData.length; i++) {
        if (this.typeData[i].isActive) {
          this.typeData[i].isActive = false;
          break;
        }
      }
      item.isActive = true;
      this.getProductByTpye(item);
    },

    //获取商品类型数据
    getTypeData() {
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          this.$toast.clear();
          if (result.data.code == 400) {
            result.data.result.forEach(v => {
              v.isActive = false;
            });
          }
          result.data.result.unshift({
            type: "isHot",
            typeDesc: "最新推荐",
            isActive: true
          });
          this.typeData = result.data.result;
          
          // 
          this.getProductByTpye({ type: "isHot" });
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //获取轮播图数据
    getBannerData() {
      if (this.bannerDataCache.length > 0) {
        this.bannerData = this.bannerDataCache;
        
        return;
      }

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          this.$toast.clear();
          this.bannerData = result.data.result;
          // 
          
          this.$store.commit("menuModule/changeData", {
            key: "bannerDataCache",
            value: result.data.result
          });
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //根据类型获取商品数据
    getProductByTpye(item) {
      if (this.products[item.type]) {
        this.productData = this.products[item.type];
        
        return;
      }

      let params = {
        appkey: this.appkey,
        key: "type",
        value: item.type
      };
      //最新推荐
      if (item.type == "isHot") {
        (params.key = "isHot"), (params.value = 1);
      }
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params
      })
        .then(result => {
          this.$toast.clear();
          this.productData = result.data.result;
          // 
          
          this.$store.commit("menuModule/changeProducts", {
            type: item.type,
            value: result.data.result
          });
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    goDetail(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    }
  }
};
</script>

<style lang="less" scoped>
</style>