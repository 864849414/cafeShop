<template>
  <div class="detail">
    <van-nav-bar left-text="返回" title="商品详情" left-arrow @click-left="goMenu" />
    <div>
      <img class="auto-img" :src="productData.large_img" />
    </div>

    <div class="detail-content">
      <div class="detail-info clearfix">
        <span class="pro-name fl">{{productData.name}}</span>
        <span class="like fr">
          <img
            class="auto-img"
            @click="likeAndNotLike"
            :src="require(isLike?'../assets/images/like_active.png':'../assets/images/like.png')"
          />
        </span>
      </div>

      <!-- 商品规格 -->
      <div class="rule-box">
        <div class="rule-item clearfix" v-for="(item,index) in productData.rules" :key="index">
          <div class="rule-title fl">{{item.title}}</div>
          <div class="rule-tags fl clearfix">
            <div
              class="tag-item fl"
              :class="{active:v.isActive}"
              v-for="(v,i) in item.tag"
              :key="i"
              @click="toggleItem(item,v)"
            >{{v.name}}</div>
          </div>
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="desc-box">
        <div class="desc-title">商品描述</div>
        <div class="desc-content">
          <div class="desc-item" v-for="(item,index) in productData.desc" :key="index">{{item}}</div>
        </div>
      </div>

      <div class="clearfix price-box">
        <div class="fl price">￥{{productData.price}}</div>
        <div class="fr">
          <van-stepper
            v-model="count"
            :integer="true"
            theme="round"
            button-size="22"
            disable-input
          />
        </div>
      </div>

      <van-goods-action>
        <van-goods-action-icon
          icon="cart-o"
          text="购物车"
          :badge="shopcartRows==0? '':shopcartRows "
          @click="goShopcart"
        />
        <van-goods-action-button color="#f8d388" type="warning" text="加入购物车" @click="addShopcart" />
        <van-goods-action-button color="#d89005" type="danger" text="立即购买" @click="buy" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/css/detail.less";
export default {
  data() {
    return {
      count: 1,
      pid: "",
      productData: {},
      isLike: "",
      shopcartRows: 0
    };
  },
  created() {
    this.pid = this.$route.query.pid;
    this.getProductDetail(this.pid);
    this.findShopcart();
    this.findLike(this.pid);
  },
  methods: {
    // 根据商品id获取商品详细数据
    getProductDetail(pid) {
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          pid,
          appkey: this.appkey
        }
      })
        .then(result => {
          this.$toast.clear();
          // 
          if (result.data.code == 600) {
            let data = result.data.result[0];
            data.desc = data.desc.split(/\n/);

            // 商品规格
            let productRule = ["cream", "milk", "sugar", "tem"];
            //  [{title: '温度', tag: [{name: '冷'}, {name: '热'}]}, {title: '糖', tag: [{name: '全糖'}, {name: '半糖'}]}]
            let rules = [];
            productRule.forEach(v => {
              if (data[v] != "") {
                let rule = {
                  title: data[v + "_desc"],
                  tag: []
                };
                let tag = data[v].split(/\//);
                tag.forEach((item, i) => {
                  let t = {
                    name: item,
                    isActive: i == 0
                  };
                  rule.tag.push(t);
                });
                rules.push(rule);
              }
            });
            data.rules = rules;

            this.productData = data;
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //切换标签
    toggleItem(item, v) {
      // 
      if (v.isActive) {
        return;
      }
      for (let i = 0; i < item.tag.length; i++) {
        if (item.tag[i].isActive) {
          item.tag[i].isActive = false;
          break;
        }
      }
      v.isActive = true;
    },

    // 收藏-取消收藏商品
    likeAndNotLike() {
      let tokenString = localStorage.getItem("__TK");
      let url = this.isLike ? "/notlike" : "/like";
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });
      
      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          // 
          if (result.data.code == 900 || result.data.code == 800) {
            this.isLike = result.data.code == 800;
            this.$toast(result.data.msg);
          } else {
            this.$touter.push({ name: "Login" });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 查询商品是否被收藏
    findLike(pid) {
      let tokenString = localStorage.getItem("__TK");

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 1000) {
            this.isLike = result.data.result.length > 0;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 返回菜单
    goMenu() {
      this.$router.go(-1);
    },

    //加入购物车
    addShopcart() {
      // 获取token
      let tokenString = localStorage.getItem("__TK");

      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0
      });

      // 获取商品规格
      let rules = this.productData.rules;
      let rule = [];
      rules.forEach(v => {
        for (let i = 0; i < v.tag.length; i++) {
          if (v.tag[i].isActive) {
            rule.push(v.tag[i].name);
          }
        }
      });
      

      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          pid: this.pid,
          count: this.count,
          rule: rule.join("/"),
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 3000) {
            if (result.data.status == 1) {
              this.shopcartRows++;
            }
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //查询购物车商品条数
    findShopcart() {
      let tokenString = localStorage.getItem("__TK");
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0
      });

      // 购物车条数
      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 5000) {
            this.shopcartRows = result.data.result.length;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 跳转到购物车
    goShopcart() {
      this.$router.push({ name: "ShopCart" });
    },

    //立即购买
    buy() {
      // 获取token
      let tokenString = localStorage.getItem("__TK");

      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0
      });

      // 获取商品规格
      let rules = this.productData.rules;
      let rule = [];
      rules.forEach(v => {
        for (let i = 0; i < v.tag.length; i++) {
          if (v.tag[i].isActive) {
            rule.push(v.tag[i].name);
          }
        }
      });
      

      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          pid: this.pid,
          count: this.count,
          rule: rule.join("/"),
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 3000) {
            let sids=[]
            sids.push(result.data.sid) ;
            this.$router.push({name:'Pay',query:{
              sids:sids.join('-')
            }})
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