import { createRouter, createWebHashHistory } from 'vue-router'
import BackoutLayout from '@/components/BackoutLayout.vue'
import Emotion from '@/views/admin/Emotion.vue'
import Conclution from '@/views/admin/Conclution.vue'
import Conclutions from '@/views/user/Conclutions.vue'
import Knowledges from '@/views/user/Knowledges.vue'
import EmotionDiary from '@/views/user/EmotionDiary.vue'
import KnowledgeDetail from '@/views/user/KnowledgeDetail.vue'
import DashBroad from '@/views/admin/DashBroad.vue'
import Knowledge from '@/views/admin/Knowledge.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FrontendLayout from '../views/user/FrontendLayout.vue'
import Home from '../views/Home.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'FrontendLayout',
      component: FrontendLayout,
      children:[
        {
          path: '',
          name: 'Home',
          component: Home,
        },
        {
          path: 'conclutions',
          name: 'Conclutions',
          component: Conclutions,
        },
        {
          path: 'knowledges',
          name: 'Knowledges',
          component: Knowledges,
        },
        {
          path: 'emotion-diary',
          name: 'EmotionDiary',
          component: EmotionDiary,
        },
        {
          path: 'knowledgeDetail/:id?',
          name: 'KnowledgeDetail',
          component: KnowledgeDetail,
        },
      ]
    },
    {
      path: '/back',
      name: 'BackoutLayout',
      component: BackoutLayout,
      redirect: '/back/emotion',
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
    },
    {
      path: '/auth',
      name: 'AuthLayout',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login,
          meta: {
            title: '登录',
            icon: 'View'
          }
        },
        {
          path: 'register',
          name: 'Register',
          component: Register,
          meta: {
            title: '注册',
            icon: 'View'
          }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (token) {
        let userInfo = null
        try {
            userInfo = JSON.parse(localStorage.getItem('username'))
        } catch {
            userInfo = null
        }
        if (userInfo && userInfo.userType === 2) {
          if (to.path.startsWith('/back')) {
            next()
          } else {
            next({ path: '/back/emotion' })
          }
        } else if (userInfo && userInfo.userType === 1) {
            if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
                next('/')
            } else {
                next()
            }
        } 
    } else {
        if (to.path.startsWith('/back')) {
            next('/auth/login')
        } else {
            next()
        }
    }
})


