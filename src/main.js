import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/elementplugin.js'

Vue.config.productionTip = false //关闭生产模式的提示

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')