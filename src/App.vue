<template>
  <div id="app">
    <router-view></router-view>
    <player-controls></player-controls>
    <van-tabbar v-model="active">
      <van-tabbar-item replace to="/home" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item replace to="/search" icon="search">搜索</van-tabbar-item>
      <van-tabbar-item replace to="/user" icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  import PlayerControls from "@/components/player-controls.vue"

  export default {
    name: "App",
    components: {
      "player-controls": PlayerControls
    },
    updated() {
      // 如果传参数
      if (this.$route.params.refresh_token) {
        console.log("获取了传入token")
        console.log(this.$route.params)
        const { access_token, refresh_token } = this.$route.params
        this.$spotifyApi.setAccessToken(access_token)
        this.$spotifyApi.saveTokens(access_token, refresh_token)
      } else {
        // 如果本地有token,配置给api模块
        const { access_token, refresh_token } = this.$spotifyApi.getTokens()
        if (access_token && refresh_token) {
          console.log("获取了本地token")
          this.$spotifyApi.setAccessToken(access_token)
        } else {
          setTimeout(() => {
            alert("跳转到登录认证页面")
            location.href = "http://124.221.148.61:8000"
          }, 1000)
        }
      }
    },
    // 实时更新tabbar高亮图标
    beforeUpdate() {
      if (this.$route.path.startsWith("/home")) {
        this.active = 0
      }
      if (this.$route.path.startsWith("/search")) {
        this.active = 1
      }
      if (this.$route.path.startsWith("/user")) {
        this.active = 2
      }
    },

    data() {
      return {
        active: null
      }
    }
  }
</script>

<style lang="less">
  .van-tabbar {
    height: 60px;
    background: linear-gradient(transparent -500%, rgb(255, 255, 255) 60%);
    border: none;
    .van-tabbar-item--active {
      background: none;
    }
  }
</style>
