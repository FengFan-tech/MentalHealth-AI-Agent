import axios from 'axios'

export const request = axios.create({
    baseURL: '/api',
    timeout: 10000
})

request.interceptors.request.use(config => {
    
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
    // 或者在发送请求之前做些什么
}, error => {
    // Do something with request error
    return Promise.reject(error)
    // 或者对请求错误做些什么
})

request.interceptors.response.use(response => {
    
    const { data } = response
    if (data.code === '200') {
        return data.data
    }  else {
        if (data.code === '-1') {
            // token 过期 ，判断是否已登录
            if (!config.url?.includes('/auth/login')) {
                // 已登录 ， 清楚 token ，跳转登录页
                localStorage.removeItem('token')
                localStorage.removeItem('userInfo')
                window.location.href = '/auth/login'
            } else {
                // 未登录，直接返回错误
                return Promise.reject('网络请求失败')
            }
        }
    }
    return response
    // 或者对响应数据做点什么
}, error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
    // 或者对响应错误做点什么
})