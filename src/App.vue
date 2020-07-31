<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
  body{
    background-color: #fdeed7;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .auto-img{
    width: 100%;
    display: block;
  }
  .clearfix::after{
    content: "";
    display: block;
    clear: both;
  }


  .van-nav-bar{
    background-color:#744514;
  }
  .van-nav-bar .van-icon{
    color: white;
  }
  .van-hairline--bottom::after{
    border: 0;
  }
  .van-nav-bar__text{
    color: white;
  }
  .van-nav-bar__title{
    color:white
  }
  .van-stepper--round .van-stepper__minus{
    color: #744514;
    border: 0.02667rem solid #744514;
  }
  .van-stepper--round .van-stepper__plus{
    background-color: #744514;
  }
  .van-checkbox__icon--checked .van-icon{
    background-color: #744514;
    border-color: #744514;
  }
  .van-submit-bar{
    background-color: #fdeed7;
  }
  .van-button--danger{
    background-color: #744514;
    border:#744514
  }
  .van-address-item .van-radio__icon--checked .van-icon{
    background-color: #744514;
    border-color: #744514;
  }
  .van-tag--danger{
    background-color: #744514;
  }
  .van-tabs__nav{
    background-color: #5c3001;
  }
  .van-tab{
    color: white;
  }
  .van-tabs__line{
    background-color: #d88f04;
  }

</style>
