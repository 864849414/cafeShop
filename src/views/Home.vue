<template>
  <div class="home">
    <div>
      <router-view></router-view>
    </div>
    <!-- 底部栏 -->
    <van-tabbar v-model="active" @change="toggleTabBar" active-color='orange' inactive-color='white'>
      <van-tabbar-item
        v-for="(item,index) in tabbarData"
        :key="index"
        :icon="item.icon"
      >{{item.title}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      tabbarData: [
        {
          title: "菜单",
          icon: "notes-o",
          name: "Menu",
          url: "menu"
        },
        {
          title: "订单",
          icon: "orders-o",
          name: "Order",
          url: "order"
        },
        {
          title: "购物车",
          icon: "shopping-cart-o",
          name: "ShopCart",
          url: "shopCart"
        },
        {
          title: "我的",
          icon: "contact",
          name: "My",
          url: "my"
        }
      ]
    };
  },

  created() {
    let url = location.hash.split("/")[2];

    for (let i = 0; i < this.tabbarData.length; i++) {
      if (this.tabbarData[i].url == url) {
        this.active = i;
      }
    }
  },

  methods: {
    toggleTabBar(index) {
      this.$router.push({ name: this.tabbarData[index].name });
    }
  }
};
</script>

<style lang="less" scoped>
  /deep/ .van-tabbar{
    background-color:#5c3000;
  }
</style>