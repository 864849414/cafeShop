<template>
  <van-list
    class="shopCart"
    v-model="loadOptions.isLoading"
    :finished="loadOptions.isFinished"
    :finished-text="loadOptions.finishedText"
    @load="onLoad"
  >
    <div>
      <div v-if="shopcartData.length==0">
        <van-empty description="购物车空空如也" />
      </div>
      <div v-else>
        <van-nav-bar :right-text="isManage?'管理':'完成'" @click-right="manage" />
      </div>

      <!-- 商品列表 -->
      <div class="list">
        <van-swipe-cell class="list-items" v-for="(item,index) in shopcartData" :key="index">
          <div class="list-item clearfix">
            <!-- 单选框 -->
            <div class="checkbox-item fl">
              <van-checkbox v-model="item.isCheck" shape="round" @click="simpleSelect" />
            </div>
            <!-- 商品信息 -->
            <div class="product-info fl clearfix">
              <div class="product-img fl">
                <img :src="item.small_img" class="auto-img" />
              </div>
              <div class="product-content fl">
                <div class="product-text">
                  <div class="product-name clearfix">
                    <div class="product-title fl">{{item.name}}</div>
                    <div class="product-rule fl">{{item.rule}}</div>
                  </div>
                  <div class="product-enname">{{item.enname}}</div>
                </div>
                <div class="product-price">
                  <div class="price fl">￥{{item.price}}</div>
                  <div class="product-count fr">
                    <van-stepper v-model="item.count" theme="round" button-size="22" disable-input 
											@change="modifyCount(item)"
										 />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template #right>
            <van-button square type="danger" text="删除" @click="removeShopcart([item.sid],index)" />
          </template>
        </van-swipe-cell>
      </div>

      <!-- 提交订单 -->
      <div v-if="isManage">
        <van-submit-bar class="submit-bar" :price="total" button-text="提交订单" :disabled="isNotHasCheck" @submit="submitPay">
          <van-checkbox v-model="allCheck" @click="allSelect">全选</van-checkbox>
        </van-submit-bar>
      </div>
      <div v-else>
        <van-submit-bar
          class="submit-bar submit-bar-delete"
          button-text="立即删除"
          :disabled="isNotHasCheck"
					@submit="removeMoreShopcart"
        >
          <van-checkbox v-model="allCheck" @click="allSelect">全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>
  </van-list>
</template>

<script>
import "../../assets/css/shopCart.less";
export default {
  data() {
    return {
      isManage: true,
      c: "",
      allCheck: false,
      isNotHasCheck: true,
      allShopcartData: [],
      shopcartData: [],

      loadOptions: {
        isLoading: true,
        isFinished: false,
        finishedText: "没有数据可加载了"
      },
      //每次加载8条数据
			loadCount: 8,
			total:0
    };
  },
  created() {
    this.getShopcartData();
  },

  methods: {
    // 获取购物车数据
    getShopcartData() {
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
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 5000) {
            result.data.result.forEach(v => {
              v.isCheck = false;
            });
            this.allShopcartData = result.data.result;
            this.shopcartData = this.allShopcartData.splice(0, this.loadCount);
            // 
            // 
            if (this.allShopcartData.length > 0) {
              this.loadOptions.isLoading = false;
            } else {
              this.loadOptions.isLoading = true;
              this.loadOptions.isFinished = true;
              this.loadOptions.finishedText=""
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //懒加载购物车数据
    onLoad() {
      
      setTimeout(() => {
        this.shopcartData.push(
          ...this.allShopcartData.splice(0, this.loadCount)
        );
        // 
        if (this.allShopcartData.length == 0) {
          // 没有数据加载
          this.loadOptions.isLoading = false;
          this.loadOptions.isFinished = true;
        }
      }, 2000);
    },

    // 全选
    allSelect() {
      
      this.shopcartData.forEach(v => {
        v.isCheck = this.allCheck;
      });
      this.allShopcartData.forEach(v => {
        v.isCheck = this.allCheck;
      });
			this.isNotHasCheck = !this.allCheck;
			this.sum();
    },

    // 单选
    simpleSelect() {
			this.sum();
      
      this.isNotHasCheck = true;
      for (let i = 0; i < this.shopcartData.length; i++) {
        if (this.shopcartData[i].isCheck) {
          this.isNotHasCheck = false;
          break;
        }
      }
      for (let i = 0; i < this.shopcartData.length; i++) {
        if (!this.shopcartData[i].isCheck) {
          this.allCheck = false;
          return;
        }
      }
      this.allCheck = true;
    },

    // 管理
    manage() {
      this.isManage = !this.isManage;
    },

    // 修改购物车数量
    modifyCount(item) {
			
			let tokenString= localStorage.getItem('__TK')
			this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
			});
			
			this.axios({
				method:'POST',
				url:'/modifyShopcartCount',
				data:{
					appkey:this.appkey,
					tokenString,
					sid: item.sid,
					count: item.count
				}
			}).then(result=>{
				this.$toast.clear()
				
				if(result.data.code==6000){
					this.sum();
				}
			}).catch(err=>{
				this.$toast.clear()
				
			})
		},

		// 单个删除购物车
		removeShopcart(sids,index){
			
			let tokenString = localStorage.getItem('__TK')
			this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
			});
			this.axios({
				method:'POST',
				url:'/removeShopcart',
				data:{
					appkey:this.appkey,
					tokenString,
					sids:JSON.stringify(sids)
				}
			}).then(result=>{
				this.$toast.clear();
				
				if(result.data.code==7000){
					this.shopcartData.splice(index,1);
					this.sum();
					if(this.shopcartData.length==0){
						this.loadOptions.finishedText=""
					}
					this.$toast('删除成功')
				}
			}).catch(err=>{
				this.$toast.clear();
				
				this.$toast('删除失败')
			})
		},

		// 删除多个购物车
		removeMoreShopcart(){
			let tokenString = localStorage.getItem('__TK')
			let sids = [];
			for(let i=0;i<this.shopcartData.length;i++){
				if(this.shopcartData[i].isCheck){
					sids.push(this.shopcartData[i].sid)
				}
			}
			
			this.$toast.loading({
        message: "加载中...",
        forbidClick: true,

        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
			});
			this.axios({
				method:'POST',
				url:'/removeShopcart',
				data:{
					appkey:this.appkey,
					tokenString,
					sids:JSON.stringify(sids)
				}
			}).then(result=>{
				this.$toast.clear();
				
				if(result.data.code==7000){
					for(let i=this.shopcartData.length-1;i>=0;i--){
						if(this.shopcartData[i].isCheck){
							this.shopcartData.splice(i,1)
						}
					}
					if(this.shopcartData.length==0){
						this.allCheck=false;
						this.isManage=true;
					}
					this.sum();
					this.$toast('删除成功')
				}
			}).catch(err=>{
				this.$toast.clear();
				this.$toast('删除失败')
				
			})
		},

		// 计算金额
		sum(){
			this.total=0;
			this.shopcartData.forEach(v=>{
				if(v.isCheck){
					this.total+=v.count * v.price *100
				}
			})
    },
    
    //提交订单
    submitPay(){
      let sids=[];
      this.shopcartData.forEach(v=>{
        if(v.isCheck){
          sids.push(v.sid);
        }
      })
      
      this.$router.push({name:'Pay',query:{
        sids:sids.join('-')
      }});
    }
  }
};
</script>

<style lang="less" scoped>
</style>