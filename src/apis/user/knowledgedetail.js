import { request } from "@/utils/sever";

export function getKnowledgeDetail(id) {
  return request({
    url: `/knowledge/article/${id}`,
    method: 'get'
  })
}
