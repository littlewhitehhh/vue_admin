import Vue from 'vue'
import App from './App.vue'
// 引入全局样式
import './assets/css/global.css'

// 引入路由
import router from './router'
// 引入elementui配置
import './plugins/elementplugin.js'
// 引入axios配置文件
import require from './network/require'
// vue全局配置require
Vue.prototype.$require = require




Vue.config.productionTip = false //关闭生产模式的提示

Vue.filter('dataFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App),

}).$mount('#app')