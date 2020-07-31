<template>
  <div class="address">
    <van-nav-bar
      :title="aid?'编辑地址':'新增地址'"
      left-text="返回"
      left-arrow  
      @click-left="goBack" 
    />
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      show-postal
      :show-delete="!!aid"
      show-set-default
      show-search-result
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save='saveAddress'
      @delete="removeAddress"
    />
  </div>
</template>

<script>
import areaList from '../assets/js/area'
import '../assets/css/address.less'
  export default {
    data() {
      return {
        areaList,

        // 地址信息
        addressInfo:{
          name:'',
          tel:'',
          province:'',
          city:'',
          county:'',
          addressDetail:'',
          areaCode:'',
          postalCode:'',
          isDefault:''
        },
        aid:''
      };
    },
    created(){
      this.aid=this.$route.params.aid;
      if(this.aid){
        this.getAddressByAid(this.aid)
      }
    },
    methods:{
      // 保存地址
      saveAddress(addressData){
        let tokenString =localStorage.getItem('__TK')
        let isSame = true;
        
        
        if(this.aid){
          for(var key in this.addressInfo){
            if(this.addressInfo[key]!=addressData[key]){
              isSame = false;
            }
          }
        }
        

        if(this.aid){
          //编辑地址
          if(!isSame){
            let userAddress = this.addressInfo
            for(let key in userAddress){
              userAddress[key]=addressData[key]
            }
            userAddress.appkey=this.appkey;
            userAddress.tokenString=tokenString;
            userAddress.aid = this.aid;
            userAddress.isDefault= Number(userAddress.isDefault)
            

            this.axios({
              method:'POST',
              url:'/editAddress',
              data:userAddress
            }).then(result=>{
              
              if(result.data.code==30000){
                this.$router.push({name:'MyAddress'})
              }
            }).catch(err=>{
              
            })
          }else{
            
          }
        }else{
          //新增地址
            let data={
              name:'',
              tel:'',
              province:'',
              city:'',
              county:'',
              addressDetail:'',
              areaCode:'',
              postalCode:'',
              isDefault:''
            }
            for(let key in data ){
              data[key]=addressData[key]
            }
            data.isDefault=Number(data.isDefault)
            data.appkey = this.appkey,
            data.tokenString=tokenString
            
            this.axios({
              method:'POST',
              url:'/addAddress',
              data
            }).then(result=>{
              
              if(result.data.code==9000){
                this.$router.push({name:'MyAddress'})
              }
            }).catch(err=>{
              
            })

        }

      },

      //根据aid获取地址
      getAddressByAid(aid){
        let tokenString = localStorage.getItem('__TK')

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method:'GET',
          url:'/findAddressByAid',
          params:{
            appkey: this.appkey,
            tokenString,
            aid
          }
        }).then(result=>{
          this.$toast.clear();
          
          if(result.data.code==40000){
            for(let key in this.addressInfo){
              this.addressInfo[key] = result.data.result[0][key]
            }  
          }
          
        }).catch(err=>{
          this.$toast.clear();
          
        })
      },

      // 删除地址
      removeAddress(){
        let tokenString = localStorage.getItem('__TK')
        this.axios({
          method:'POST',
          url:'/deleteAddress',
          data:{
            appkey:this.appkey,
            aid:this.aid,
            tokenString
          }
        }).then(result=>{
          
          if(result.data.code==10000){
            this.$router.push({name:'MyAddress'})
          }
        }).catch(err=>{
          
        })
      },

      //返回上一层
      goBack(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>