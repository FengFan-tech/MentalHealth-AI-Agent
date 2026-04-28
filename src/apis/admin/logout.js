import { request } from '@/utils/sever'

export function logout() {
    return request({
        url: '/user/logout',
        method: 'post',
    })
}