import VueRouter from "vue-router"
import Vue from "vue"

Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: "/get-token/:access_token/:refresh_token",
    redirect: (to) => {
      const { params } = to
      return { name: "home", params }
    }
  },
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/home.vue")
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../views/search.vue")
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../views/user.vue")
  }
]

const router = new VueRouter({
  routes
})

export default router
