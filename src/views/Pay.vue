<template>
  <div class="pay">
    <van-nav-bar
      title="提交订单"
      left-text="返回"
      left-arrow
      @click-left='back'
    />
    <div class="pay-box">
      <div class="address" @click="openPopup">{{userAddress.address}}</div>
      <div class="pay-content">
        <div class="pay-item">

          <div class="items clearfix" v-for="(item,index) in orderData" :key="index">
            <div class="pro-img fl">
              <img class="auto-img" :src=item.small_img >
            </div>
            <div class="pro-info fl">
              <div class="fl">
                <div class="names">
                  <div class="zh-name">{{item.name}}</div>
                  <div class="en-name">{{item.enname}}</div>
                </div>
                <div class="rule">{{item.rule}}</div>
              </div>
              <div class="fr">
                <div class="price">￥{{item.price}}</div>
                <div class="count">x{{item.count}}</div>
              </div>
            </div>
          </div>


          <div class="pay-total clearfix">
            <div class="fr clearfix">
              <span class="fl total-count">共计{{counts}}件商品 合计：</span>
              <span class="fl total-price">￥{{total}}</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <van-submit-bar :price="total*100" button-text="立即结算" @submit="commit" />

    
    <van-popup class="popup-box" v-model="isOpen" position="bottom" >
      <van-address-list
        v-model="aid"
        :list="addressList"
        default-tag-text="默认"
        @select="selectAddress"
        @add="goAddress"
      />
    </van-popup>
  </div>
</template>

<script>
import '../assets/css/pay.less'
  export default {
    data(){
      return{
        isOpen:false,
        aid:'',
        addressList: [],
        userAddress:{
          address:'请选择收货地址',
          phone:'',
          receiver:''
        },
        sids:[],
        counts:0,
        total:0,
        orderData:[]
      }
    },
    created(){
      this.getAddressData();
      this.sids=this.$route.query.sids.split('-')
      
      this.getPayOrderData(this.sids)
    },
    methods:{

      openPopup(){
        this.isOpen = true;
      },

      //获取地址数据
      getAddressData() {

        let tokenString = localStorage.getItem('__TK');

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method: 'GET',
          url: '/findAddress',
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 20000) {
            result.data.result.forEach(v => {
              let currentAddress = {
                id: v.aid,
                tel: v.tel,
                name: v.name,
                address: v.province + v.city + v.county + v.addressDetail,
                isDefault: Boolean(v.isDefault)
              };

              //默认选择默认地址
              if (v.isDefault) {
                this.aid = v.aid;

                //如果存在默认地址，则默认选择默认地址
                this.userAddress.address = currentAddress.address;
              }
              
              this.addressList.push(currentAddress);
            })
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //选择地址
      selectAddress(item){
        
        this.isOpen=false;

        this.userAddress = {
          address: item.address,
          phone:item.tal,
          receiver: item.name
        }
      },

      //获取提交订单数据
      getPayOrderData(sids){
        let tokenString=localStorage.getItem('__TK')
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'GET',
          url:'/commitShopcart',
          params:{
            appkey:this.appkey,
            tokenString,
            sids:JSON.stringify(sids)
          }
        }).then(result=>{
          this.$toast.clear();
          
          if(result.data.code==50000){
            result.data.result.forEach(v=>{
              this.counts += v.count;
              this.total +=v.count * v.price;
            })
            this.orderData = result.data.result;
            
          }
        }).catch(err=>{
          this.$toast.clear();
          
        })
      },

      //提交订单
      commit(){
        if(this.userAddress.address == '请选择收货地址'){
          this.$toast('请选择收货地址');
          return;
        }
        let tokenString =localStorage.getItem('__TK')  
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'POST',
          url:'/pay',
          data:{
            appkey:this.appkey,
            tokenString,
            sids:JSON.stringify(this.sids),
            phone:this.userAddress.phone,
            address:this.userAddress.address,
            receiver:this.userAddress.receiver
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code === 60000) {
            this.$router.push({name: 'Order'});
          }
        }).catch(err => {
          this.$toast.clear();
          
        })

         

      },

      //返回
      back(){
        this.$router.go(-1)
      },

      //跳转新增地址界面
      goAddress(){
        this.$router.push({name:'Address'})
      }
    }
  }
</script>

<style lang="less" scoped>

</style>