import { request } from '@/utils/sever'

export const getKnowledges = () => {
    return request({
        url: '/knowledge/article/page',
        method: 'get'
    })
}