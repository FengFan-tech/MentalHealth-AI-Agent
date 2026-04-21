import {request} from '@/utils/sever'

// http://159.75.169.224:1235/api/user/login
export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}


// 获取分类
export function categoryTree() {
    return request({
        url: '/knowledge/category/tree',
        method: 'get',
    })
}

// 获取知识文章列表
export function articleList(data) {
    return request({
        url: '/knowledge/article/page',
        method: 'get',
        params: data
    })
}
