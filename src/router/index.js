import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入router组件
import Login from '../views/Login/Login'
import Home from '../views/home/home'
import Welcome from '../views/home/welcome'

import Users from '../views/Users/Users'
import Roles from '../views/Role/roles'
import Rights from '../views/Role/rights'
import Goods from '../views/goods/goods'
import addGoods from '../views/goods/add'
import Params from '../views/params/params'
import Categories from '../views/categories/categories'

Vue.use(VueRouter)

const routes = [
    // 重定向
    {
        path: '/',
        redirect: '/login'
    },

    // 登录首页 Login
    {
        name: 'Login',
        path: '/login',
        component: Login,
    },
    // Home页面
    {
        name: 'Home',
        path: '/home',
        component: Home,
        children: [{
                path: '/home',
                redirect: '/welcome'
            },
            {
                name: 'Welcome',
                path: '/welcome',
                component: Welcome
            },
            {
                name: 'Users',
                path: '/users',
                component: Users
            },
            {
                name: 'Rolse',
                path: '/roles',
                component: Roles
            },
            {
                name: 'Rights',
                path: '/rights',
                component: Rights
            },
            {
                name: 'Goods',
                path: '/goods',
                component: Goods,

            },
            {
                name: 'addGoods',
                path: '/goods/add',
                component: addGoods
            },
            {
                name: 'params',
                path: '/params',
                component: Params
            },
            {
                name: 'categories',
                path: '/categories',
                component: Categories
            }



        ]

    }

]

const router = new VueRouter({
        routes,

    })
    //挂载路由导航首位
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from代表从哪个路径跳转而来
    //next 是一个函数，表示放行   next()放行   next('/login')强制跳转
    // console.log(to, from);
    if (to.path == '/login') { return next() } else {
        const _token = window.sessionStorage.getItem('token');
        if (!_token) return next('/login')
        next()
    }
})
export default router