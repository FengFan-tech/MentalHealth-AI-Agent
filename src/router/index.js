import { createRouter, createWebHashHistory } from 'vue-router'
import BackoutLayout from '@/components/BackoutLayout.vue'
import Emotion from '@/views/Emotion.vue'
import Conclution from '@/views/Conclution.vue'
import DashBroad from '@/views/DashBroad.vue'
import Knowledge from '@/views/Knowledge.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'BackoutLayout',
      component: BackoutLayout,
      children: [
        {
          path: 'emotion',
          name: 'Emotion',
          component: Emotion,
          meta: {
            title: '情感分析',
            icon: 'View'
          }
        },
        {
            path: 'conclusion',
            name: 'Conclusion',
            component: Conclution,
            meta: {
                title: '结论分析',
                icon: 'View'
            }
        },
        {
            path: 'dashbroad',
            name: 'DashBroad',
            component: DashBroad,
            meta: {
                title: '数据大屏',
                icon:   'View'
            }
        },
        {
            path: 'knowledge' ,
            name: 'Knowledge',
            component: Knowledge,
            meta: {
                title: '知识库',
                icon:   'View'
            }
        }
      ]
    }
  ]
})