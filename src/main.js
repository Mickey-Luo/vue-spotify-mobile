import Vue from "vue"
import App from "./App.vue"

Vue.config.productionTip = false

// spotifyApi
import spotifyApi from "@/api/spotifyApi"
Vue.prototype.$spotifyApi = spotifyApi

// Vant
import {
  Cell,
  CellGroup,
  List,
  Tabbar,
  TabbarItem,
  Col,
  Row,
  Icon,
  Grid,
  GridItem,
  Lazyload,
  Image as VanImage
} from "vant"

Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(List)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Col)
Vue.use(Row)
Vue.use(Icon)
Vue.use(Grid)
Vue.use(GridItem)
Vue.use(Lazyload, {
  lazyComponent: true
})
Vue.use(VanImage)

// VueRouter
import router from "./router/index"

new Vue({
  router,
  render: (h) => h(App)
}).$mount("#app")
