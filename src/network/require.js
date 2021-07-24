// 引入axios
import axios from 'axios'


// 创建axios实例
const require = axios.create({
    baseURL: '//127.0.0.1:8888/api/private/v1/', //api 的基本路径
    timeout: 5000, //超时时间

})

// 请求拦截器
require.interceptors.request.use(function(config) {
        // 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
        config.headers.Authorization = window.sessionStorage.getItem('token')
            // console.log(config.headers);
        return config


    })
    // 响应拦截器
    // require.interceptors.response.use()


export default require