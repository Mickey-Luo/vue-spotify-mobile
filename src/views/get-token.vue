<template>
  <div>加载中...</div>
</template>

<script>
export default {
  created() {
    // 如果路由中有token,储存并配置给api模块
    if (this.$route.params.access_token) {
      console.log(2)
      let _token = this.$route.params.access_token
      localStorage.setItem("vant_spotify_token", _token)
      this.$spotifyApi.setAccessToken(_token)
    }
    // 如果本地有token,配置给api模块
    else if (localStorage.getItem("vant_spotify_token")) {
      console.log(1)
      this.$spotifyApi.setAccessToken(localStorage.getItem("vant_spotify_token"))
    } else {
      // 如果都没有token,跳转到认证页面
      location.href = "http://localhost:8888"
    }
    // 等带一会路由掉home页面
    // setTimeout(() => {
    this.$router.push("/home")
    // }, 500)
  }
}
</script>

<style lang="less"></style>
