import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '../src/assets/icon/iconfont.css'

Vue.config.productionTip = false

//导入vant框架
import 
    { 
      NavBar,
      Form,
      Field,
      Button,
      Icon,
      Col, Row,
      Search,
      Swipe, SwipeItem ,
      Toast,
      Tabbar,
      TabbarItem,
      goodsActionIcon,
      goodsActionButton,
      goodsAction,
      stepper,
      Empty,SwipeCell,
      CheckboxGroup,Checkbox,
      SubmitBar,
      List,
      AddressEdit,
      AddressList,
      Popup,
      Tab,Tabs,
      Cell,CellGroup,
      Uploader ,Dialog 
    } 
from 'vant';

// 用于设置 rem 基准值
import 'lib-flexible' 

// 注册vant框架框架组件
Vue
.use(NavBar).use(Form).use(Field).use(Button).use(Icon).use(Col).use(Row).use(Search).use(Swipe)
.use(SwipeItem).use(Toast).use(Tabbar).use(TabbarItem).use(goodsActionIcon).use(goodsActionButton)
.use(goodsAction).use(stepper).use(Empty).use(SwipeCell).use(CheckboxGroup).use(Checkbox).use(SubmitBar)
.use(List).use(AddressEdit).use(AddressList).use(Popup).use(Tab).use(Tabs).use(Cell).use(CellGroup)
.use(Uploader).use(Dialog)
// 引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'
// 注册axios
Vue.use(VueAxios, axios)

//配置请求基础路径
axios.defaults.baseURL='http://www.kangliuyong.com:10002'
//配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
//发起请求之前处理
axios.interceptors.request.use(config=>{
  if(config.method=='post'){
    let paramsString='';
    for(let key in config.data){
      paramsString+=key +"="+config.data[key]+'&'
    }
    config.data = paramsString.slice(0,-1);
  }
  return config;
})
Vue.config.productionTip=false
// 添加appkey属性保存appkey
Vue.prototype.appkey='U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
