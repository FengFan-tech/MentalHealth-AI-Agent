import { request } from '@/utils/sever'

export function register(data) {
    return request({
        url: '/user/add',
        method: 'post',
        data
    })
}