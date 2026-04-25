import { request } from '@/utils/sever';

// 分页查询情绪日志
export function getEmotionLogs(data) {
    return request({
        url: '/emotion-diary/admin/page',
        method: 'get',
        params: data
    })
}
