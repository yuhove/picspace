import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
//首页

const router=new Router({
  routes: [
    {
      path: '/',
      name:'login',
      component: () => import('@/page/records/login'),
      meta: {title:['登录']},
    },
    {
      path: '/404',
      name:'404',
      component: () => import('@/components/404'),
      meta: {title:['登录']},
    },
    {
      path: '/bridge',
      name:'bridge',
      component: () => import('@/page/home/bridge'),
      meta: {title:['空白']},
    },
    {
      path: '/manage',
      name:'manage',
      component: () => import('@/page/manage'),
      children: [
        {
          path: '/home',
          name:'home',
          component: () => import('@/page/home'),
          meta: {title:['首页'],affix:true},
        },
        {
          path: '/adminslist',
          name:'adminslist',
          component: () => import('@/page/records/adminslist'),
          meta: {title:['系统管理', '管理员列表']},
        },
        {
          path: '/rolelist',
          name:'rolelist',
          component: () => import('@/page/records/rolelist'),
          meta: {title:['系统管理', '身份角色']},
        },
        {
          path: '/managelist',
          name:'managelist',
          component: () => import('@/page/records/managelist'),
          meta: {title:['系统管理', '后台页面目录管理']},
        },
        {
          path: '/iconlist',
          name:'iconlist',
          component: () => import('@/page/records/iconlist'),
          meta: {title:['系统管理', '权限按钮管理']},
        },
        ]
    }
  ],
  strict: process.env.NODE_ENV !== 'production',
})

// export default new Router({
//   router,
//   //mode: 'history',
//   strict: process.env.NODE_ENV !== 'production',
// })
export default router
