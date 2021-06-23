import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  const adminAuth = to.matched.some(x => x.meta.adminAuth)
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  console.log('Token: ', hasToken)
  console.log('Path: ', to.path)

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      console.log('Automatically directed to login')
      NProgress.done()
    } else if (to.path === '/admin/index') {
      if (adminAuth && store.getters.username === 'admin') {
        console.log('Yes it is admin')
        next()
      } else {
        next(`/dashboard?redirect=${to.path}`)
      }
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.username
      if (hasGetUserInfo) {
        console.log('Yes it is having info')
        next()
        NProgress.done()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          console.log('Getting user info')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          console.log('Catching error')
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      console.log('Go to guest window')
      next()
    } else {
      console.log('Back to login')
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
