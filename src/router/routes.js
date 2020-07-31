export const routes = [
    {
        path:'/',
        redirect:'/login'
    },
    // 注册
    {
        path:'/register',
        name:'Register',
        component:()=>import('../views/Register.vue')
    },
    // 登录
    {
        path:'/login',
        name:'Login',
        component:()=>import('../views/Login.vue')
    },
    // 首页
    {
        path:'/home',
        name:'Home',
        redirect:'/home/menu',
        component:()=>import('../views/Home.vue'),
        children:[
            {
                path:'menu',
                name:'Menu',
                component:()=>import('../views/homeViews/Menu.vue'),
            },    
            {
                path:'shopCart',
                name:'ShopCart',
                component:()=>import('../views/homeViews/ShopCart.vue'),
            },      
            {
                path:'my',
                name:'My',
                component:()=>import('../views/homeViews/My.vue'),
            },                  
            {
                path:'order',
                name:'Order',
                component:()=>import('../views/homeViews/Order.vue'),
            },                  
        ]
    },
    // 详细描述
    {
        path:'/detail',
        name:'Detail',
        component:()=>import('../views/Detail.vue')
    },
    // 地址
    {
        path:'/address/:aid?',
        name:'Address',
        component:()=>import('../views/Address.vue')
    },
        // 地址
    {
        path:'/myAddress',
        name:'MyAddress',
        component:()=>import('../views/MyAddress.vue')
    },
    //支付
    {
        path:'/pay',
        name:'Pay',
        component:()=>import('../views/Pay.vue')
    },
    {
        path:'/like',
        name:'Like',
        component:()=>import('../views/Like.vue')
    },
    {
        path:'/account',
        name:'Account',
        component:()=>import('../views/Account.vue')
    },
    {
        path:'/setUp',
        name:'SetUp',
        component:()=>import('../views/SetUp.vue')
    },
    {
        path:'/forgot',
        name:'Forgot',
        component:()=>import('../views/Forgot.vue')
    },
    


]