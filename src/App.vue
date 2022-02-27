<template>
  <div id="app">
    <router-view></router-view>
    <van-tabbar v-model="active">
      <van-tabbar-item replace to="/home" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item replace to="/search" icon="search">搜索</van-tabbar-item>
      <van-tabbar-item replace to="/user" icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  created() {
    // 如果本地有token,配置给api模块
    if (localStorage.getItem("vant_spotify_token")) {
      this.$spotifyApi.setAccessToken(localStorage.getItem("vant_spotify_token"))
    }
    // 如果路由中有token,储存并配置给api模块
    else if (this.$route.params.access_token) {
      let _token = this.$route.params.access_token
      localStorage.setItem("vant_spotify_token", _token)
      this.$spotifyApi.setAccessToken(_token)
    } else {
      // 如果都没有token,跳转到认证页面
      location.href = "http://localhost:8888"
    }
    // 等带一会路由掉home页面
    setTimeout(() => {
      this.$router.push("/home")
    }, 500)
  },
  name: "App",
  components: {},
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
