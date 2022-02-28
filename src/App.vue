<template>
  <div id="app">
    <router-view></router-view>
    <div class="player-controls">
      <div class="container">
        <div>
          <p>2333</p>
          <p>2333</p>
        </div>
        <van-icon name="play" size="34px" />
      </div>
    </div>
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
        console.log("已经获得token")
        this.$spotifyApi.setAccessToken(localStorage.getItem("vant_spotify_token"))
      } else {
        // 如果都没有token,跳转到认证页面
        location.href = "http://localhost:8888"
      }
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
  }

  .player-controls {
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 64px;

    .container {
      box-sizing: border-box;
      margin: 0 auto;
      padding: 4px 8px;
      height: 100%;
      max-width: 360px;
      border-radius: 10px;
      background-color: #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      & * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
    }
  }
</style>
