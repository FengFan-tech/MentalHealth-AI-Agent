import { createRouter, createWebHashHistory } from 'vue-router'

const BackoutLayout = () => import('@/components/BackoutLayout.vue')
const FrontendLayout = () => import('@/views/user/FrontendLayout.vue')
const AuthLayout = () => import('@/components/AuthLayout.vue')

const Emotion = () => import('@/views/admin/Emotion.vue')
const Conclution = () => import('@/views/admin/Conclution.vue')
const DashBroad = () => import('@/views/admin/DashBroad.vue')
const Knowledge = () => import('@/views/admin/Knowledge.vue')

const Conclutions = () => import('@/views/user/Conclutions.vue')
const Knowledges = () => import('@/views/user/Knowledges.vue')
const EmotionDiary = () => import('@/views/user/EmotionDiary.vue')
const KnowledgeDetail = () => import('@/views/user/KnowledgeDetail.vue')

const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const Home = () => import('@/views/Home.vue')

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'FrontendLayout',
      component: FrontendLayout,
      meta: { noCache: true },
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
          meta: { noCache: true },
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
          meta: { noCache: true },
        },
        {
          path: 'knowledgeDetail/:id?',
          name: 'KnowledgeDetail',
          component: KnowledgeDetail,
          meta: { noCache: true },
        },
      ]
    },
    {
      path: '/back',
      name: 'BackoutLayout',
      component: BackoutLayout,
      redirect: '/back/emotion',
      meta: { noCache: true },
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
      meta: { noCache: true },
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login,
          meta: {
            title: '登录',
            icon: 'View',
            noCache: true
          }
        },
        {
          path: 'register',
          name: 'Register',
          component: Register,
          meta: {
            title: '注册',
            icon: 'View',
            noCache: true
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


