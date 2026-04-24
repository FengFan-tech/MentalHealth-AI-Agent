import {request} from '@/utils/sever'


// 获取会话消息列表
export function getSessionMessages(data) {
    return request({
        url: '/psychological-chat/sessions',
        method: 'get',
        params: data
    })
}