import { createRouter, createWebHashHistory } from 'vue-router'
import BackoutLayout from '@/components/BackoutLayout.vue'
import Emotion from '@/views/Emotion.vue'
import Conclution from '@/views/Conclution.vue'
import DashBroad from '@/views/DashBroad.vue'
import Knowledge from '@/views/Knowledge.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import AuthLayout from '@/components/AuthLayout.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/back',
      name: 'BackoutLayout',
      component: BackoutLayout,
      redirect: '/back/knowledge',
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
            userInfo = JSON.parse(localStorage.getItem('userInfo'))
        } catch {
            userInfo = null
        }
        if (userInfo && userInfo.userType === 2) {
          if (to.path.startsWith('/back')) {
            next()
          } else {
            next({ path: '/back/knowledge' })
          }
        } else if (userInfo && userInfo.userType === 1) {
            next()
        } else {
            next('/auth/login')
        }
    } else {
        if (to.path.startsWith('/back')) {
            next('/auth/login')
        } else {
            next()
        }
    }
})


