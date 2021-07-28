import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入router组件
import Login from '../views/Login/Login'
import Home from '../views/home/home'
import Welcome from '../views/home/welcome'

import Users from '../views/Users/Users'
import Roles from '../views/Role/roles'


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
            /* {
                name: 'Users',
                path: '/rights',
                component: Users
            }, */
            /* {
                name: 'Users',
                path: '/goods',
                component: Users
            }, */

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