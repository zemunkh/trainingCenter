import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Үндсэн цонх', icon: 'dashboard' }
    }]
    // meta : {
    //   roles: ['admin', 'editor']
    // }
  },
  {
    path: '/admin',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Admin',
      component: () => import('@/views/admin/index'),
      meta: { title: 'Админ удирдлага', icon: 'new' }
    }]
    // meta: {
    //   requiresAuth: true
    // }
  },
  {
    path: '/customers',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Customers',
        component: () => import('@/views/customers/index'),
        meta: { title: 'Үйлчлүүлэгчид', icon: 'users' }
      }
    ]
  },
  {
    path: '/court',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Court',
        component: () => import('@/views/court/index'),
        meta: { title: 'Спорт заал', icon: 'basketball' }
      }
    ]
  },
  {
    path: '/pool',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Pool',
        component: () => import('@/views/pool/index'),
        meta: { title: 'Усан бассейн', icon: 'swimming' }
      }
    ]
  },
  {
    path: '/fitness',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Fitness',
        component: () => import('@/views/fitness/index'),
        meta: { title: 'Фитнесс', icon: 'heavylifting' }
      }
    ]
  },
  {
    path: '/yoga',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Yoga',
        component: () => import('@/views/yoga/index'),
        meta: { title: 'Иога Аэробек', icon: 'yoga' }
      }
    ]
  },
  {
    path: '/sub-court',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Sub court',
        component: () => import('@/views/subCourt/index'),
        meta: { title: 'Туслах танхим', icon: 'tree' }
      }
    ]
  },
  {
    path: '/register',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Register',
        component: () => import('@/views/register/index'),
        meta: { title: 'Бүртгэл', icon: 'form' }
      }
    ]
  },
  {
    path: '/add',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Add',
        component: () => import('@/views/add/index'),
        meta: { title: 'Шинээр бүртгэх', icon: 'new' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
