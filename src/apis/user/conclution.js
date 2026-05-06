import { request } from '@/utils/sever'

// 创建新的会话
export function getNewConclution(params) {
  return request({
    url: '/psychological-chat/session/start',
    method: 'post',
    params
  })
}

// 分页查询咨询会话
export function getConclutionList(params) {
  return request({
    url: '/psychological-chat/sessions',
    method: 'get',
    params
  })
}

// 删除咨询会话
export function deleteConclution(params) {
  return request({
    url: `/psychological-chat/sessions/${params.sessionId}`,
    method: 'delete',
    params
  })
}

// 获取咨询会话详情
export function getConclutionDetail(sessionId) {
  return request({
    url: `/psychological-chat/sessions/${sessionId}/messages`,
    method: 'get',
  })
}

// 获取会话情绪分析结果
export function getEmotionAnalysis(sessionId) {
  return request({
    url: `/psychological-chat/session/${sessionId}/emotion`,
    method: 'get',
  })
}

