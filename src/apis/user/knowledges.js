import { request } from '@/utils/sever'

export const getKnowledges = (params) => {
    return request({
        url: '/knowledge/article/page',
        method: 'get',
        params
    })
}