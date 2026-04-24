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

// 封面上传
export function uploadCover(file , businessInfo) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessType', 'ARTICLE')
    formData.append('businessField', 'cover')
    formData.append('businessId', businessInfo.businessId)
    return request({
        url: '/file/upload',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 文章上传
export function uploadArticle(file) {
   return request({
        url: '/knowledge/article',
        method: 'post',
        data: file,
    })
}

// 文章编辑
export function editArticle(id, data) {
    return request({
        url: `/knowledge/article/${id}`,
        method: 'put',
        data
    })
}

// 获取文章详情
export function articleDetail(id) {
    return request({
        url: `/knowledge/article/${id}`,
        method: 'get',
    })
}

// 更新文章状态
export function updateArticleStatus(id, status) {
    return request({
        url: `/knowledge/article/${id}/status`,
        method: 'put',
        data: {
            status
        }
    })
}

// 删除文章
export function deleteArticle(id) {
    return request({
        url: `/knowledge/article/${id}`,
        method: 'delete',
    })
}