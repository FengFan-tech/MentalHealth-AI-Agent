import {request}  from '@/utils/sever';

export function getDashbroadData() {
    return request({
        url: '/data-analytics/overview',
        method: 'get'
    })
}