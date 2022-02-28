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
    created() {
      // 如果本地有token,配置给api模块
      if (localStorage.getItem("vant_spotify_token")) {
        console.log("已经获得token")
        this.$spotifyApi.setAccessToken(localStorage.getItem("vant_spotify_token"))
      } else {
        // 如果都没有token,跳转到认证页面
        location.href = "http://localhost:8888"
      }
    },
    data() {
      return {
        active: 0
      }
    }
  }
</script>

<style lang="less">
  /* #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  } */
  .van-tabbar {
    height: 60px;
    background-color: #fff;

    background: linear-gradient(transparent -300%, rgb(255, 255, 255) 80%);

    .van-tabbar-item--active {
      background: none;
    }
  }
</style>
