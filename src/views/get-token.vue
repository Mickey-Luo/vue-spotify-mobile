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
   
    // 等带一会路由掉home页面
    // setTimeout(() => {
    this.$router.push("/home")
    // }, 500)
  }
}
</script>

<style lang="less"></style>
