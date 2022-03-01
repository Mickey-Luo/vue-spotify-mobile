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
    mounted() {
      // 如果本地有token,配置给api模块
      this.$nextTick(() => {
        if (!this.$route.path.startsWith("/get-token")) {
          if (localStorage.getItem("vant_spotify_token")) {
            console.log("已经获得token")
            this.$spotifyApi.setAccessToken(localStorage.getItem("vant_spotify_token"))
          } else {
            // 如果都没有token,跳转到认证页面
            console.log("没有获得token")
            location.href = "http://124.221.148.61:8000"
          }
        }
      })
    },
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
