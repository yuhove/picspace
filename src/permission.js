import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 这只是简单示范 建议结合cookie或token使用
router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
    // if (to.name == 'login') {
    //     // 如果有用户信息 直接转到首页
    //     if (store.state.user.name) {
    //         next({name: 'home'})
    //     } else {
    //         next()
    //     }
    // } else {
    //     // 如果有用户信息 则跳转 否则跳转到登陆页
    //     if (store.state.user.name) {
    //         next()
    //     } else {
    //         next({name: 'login'})
    //     }
    // }
})
router.afterEach((to,from,next) => {
    NProgress.done()
    if(to.path == 'home') {
      location.reload();
      this.$router.go(0)
    }
});