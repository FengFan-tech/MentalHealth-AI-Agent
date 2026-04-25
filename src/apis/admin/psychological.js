import {request} from '@/utils/sever'


// 获取会话消息列表
export function getSessionMessages(data) {
    return request({
        url: '/psychological-chat/sessions',
        method: 'get',
        params: data
    })
}

// 获取会话详情
export function getSessionDetail(sessionId) {
    return request({
        url: `/psychological-chat/sessions/${sessionId}/messages`,
        method: 'get'
    })
}