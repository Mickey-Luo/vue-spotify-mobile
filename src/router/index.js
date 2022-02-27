import VueRouter from "vue-router"
import Vue from "vue"

Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: "/get-token/:access_token",
    component: () => import("../views/get-token.vue")
  },
  {
    path: "/home",
    component: () => import("../views/home.vue")
  },
  {
    path: "/search",
    component: () => import("../views/search.vue")
  },
  {
    path: "/user",
    component: () => import("../views/user.vue")
  }
]

const router = new VueRouter({
  routes
})

export default router
