import { request } from '@/utils/sever';

// 创建或更新情绪日志
export function createOrUpdateEmotionDiary(params) {
  return request({
    url: '/emotion-diary',
    method: 'post',
    params
  })
}