<template>
  <div class="order">
    <van-tabs v-model="activeName" @change='toggleOrderStatus'>
      
      <van-tab :title="item.title" :name='item.name' v-for='(item,index) in tabData' :key='index' >
        <div class="order-content">
          <div class="order-items">

            <!-- 一个订单开始 -->
            <div class="pay-item" v-for="(item1,index1) in orderNoData" :key='index1'>
              
              <div class="order-item-title clearfix">
                <div class="order-no fl">{{orderNoData[index1]}}</div>
                <div class="fr" v-if="orderData[item1].status==1">
                  <span class="confirm" @click='recieve(item1)'>确认收货</span>
                </div>
                <div class="fr" v-else>
                  <span class="confirm" >已收货</span>
                  <span class="delete" @click="delOrder(item1)">
                    <van-icon class="delete-icon" name="delete" />
                  </span>
                </div>

              </div>

              <div class="items clearfix" v-for="(v,i) in orderData[item1].data" :key='i'>
                <div class="pro-img fl">
                  <img class="auto-img" :src="v.smallImg" >
                </div>
                <div class="pro-info fl">
                  <div class="fl">
                    <div class="names">
                      <div class="zh-name">{{v.name}}</div>
                      <div class="en-name">{{v.enname}}</div>
                    </div>
                    <div class="rule">{{v.rule}}</div>
                  </div>
                  <div class="fr">
                    <div class="price">￥{{v.price}}</div>
                    <div class="count">x{{v.count}}</div>
                  </div>
                </div>
              </div>



              <div class="pay-total clearfix">
                <div class="fr clearfix">
                  <span class="fl total-count">共计{{orderData[item1].count}}件商品 合计：</span>
                  <span class="fl total-price">￥{{orderData[item1].total}}</span>
                </div>
              </div>

            </div>
            <!-- 一个订单结束 -->

          </div>
        </div>
      </van-tab>

    </van-tabs>
  </div>
</template>

<script>
import '../../assets/css/order.less'
  export default {
    data(){
      return{
        activeName:'0',
        tabData:[
          {
            title:'全部',
            name:'0'
          },
          {
            title:'待收货',
            name:'1'
          },
          {
            title:'已收货',
            name:'2'
          }
        ],
        isRecieve:false,
        orderNoData:[],
        orderData:{}
      }
    },
    created(){
      this.getOrderProduct();
    },
    methods:{
      //切换不同状态的商品
      toggleOrderStatus(){
        this.getOrderProduct();
      },
      // 获取订单商品
      getOrderProduct(){
        let tokenString = localStorage.getItem('__TK')
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'GET',
          url:'/findOrder',
          params:{
            appkey:this.appkey,
            tokenString,
            status: this.activeName
          }
        }).then(result=>{
          this.$toast.clear();
          

          //获取单号数据
          let oids=[]
          result.data.result.forEach(v=>{
            if(oids.indexOf(v.oid)==-1){
              oids.push(v.oid)
            }
          })
          this.orderNoData = oids;
          
          //按订单号筛选商品
          let orderData={};
          //  {
          //    vid:{
          //      data:[
          //        {v},
          //        {v}
          //      ]
          //    }
          //  }
          result.data.result.forEach(v=>{
            if(!orderData[v.oid]){
              //如果当前订单不存在，则添加一个
              orderData[v.oid] = {
                data:[v],
                status:v.status,
                date:v.createdAt,
                count:v.count,
                total:v.count*v.price
              }
            }else{
              orderData[v.oid].data.push(v);
              orderData[v.oid].count+=v.count;
              orderData[v.oid].total+=v.count*v.price
            }
          })
          
          this.orderData=orderData;

        }).catch(err=>{
          this.$toast.clear()
          
        })
      },

      // 确认收货
      recieve(oid){
        let tokenString = localStorage.getItem('__TK')
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'POST',
          url:'/receive',
          data:{
            appkey:this.appkey,
            tokenString,
            oid
          }
        }).then(result=>{
          this.$toast.clear()
          
          if(result.data.code==80000){
            if(this.activeName==1){
              let index = this.orderNoData.indexOf(oid)
              
              this.orderNoData.splice(index,1)
            }else{
              this.getOrderProduct()
            }
          }
        }).catch(err=>{
          this.$toast.clear()
          

        })
      },
      
      // 删除订单
      delOrder(oid){
        let tokenString = localStorage.getItem('__TK')
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        })

        this.axios({
          method:'POST',
          url:'removeOrder',
          data:{
            appkey: this.appkey,
            tokenString,
            oid
          }
        }).then(result=>{
          this.$toast.clear()
          
          if(result.data.code==90000){
            let index = this.orderNoData.indexOf(oid)
            this.orderNoData.splice(index,1)
          }
        }).catch(err=>{
          this.$toast.clear()
          
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>