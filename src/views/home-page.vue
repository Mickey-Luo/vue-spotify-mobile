<template>
  <div id="home-page">
    <van-row class="top" type="flex" justify="space-between">
      <van-col class="welcome" span="9"><p>晚上好</p></van-col>
      <van-col class="icons" span="9"
        ><van-icon name="bullhorn-o" size="30" /><van-icon name="clock-o" size="30" /><van-icon name="setting-o" size="30"
      /></van-col>
    </van-row>
    <div class="grid" clickable>
      <div class="grid-item" @click="go('tracklist', 'my')"><van-icon name="like" size="18px" />已点赞的歌</div>
      <div class="grid-item" @click="go('tracklist', 'my')"><van-icon name="like" size="18px" />已点赞的歌</div>
      <div class="grid-item" @click="go('tracklist', 'my')"><van-icon name="like" size="18px" />已点赞的歌</div>
      <div class="grid-item" @click="go('tracklist', 'my')"><van-icon name="like" size="18px" />已点赞的歌</div>
    </div>
    <!-- 列表 -->
    <list-scroll v-for="(playlists, index) in listCollection" :key="index" :playlists="playlists" @go="go"></list-scroll>
  </div>
</template>

<script>
  import listScroll from "../components/list-scroll.vue"
  export default {
    name: "home-page",
    components: {
      "list-scroll": listScroll,
    },
    data() {
      return {
        // 滚动距离
        scrollTop: 0,
        listCollection: [],
      }
    },
    methods: {
      // 导航
      go(dest, playlistId) {
        this.$emit("go", dest, playlistId)
      },
      backward() {
        this.$emit("backward")
      },
      // 获取滚动距离
      scroll() {
        this.scrollTop = this.$refs.tracklist.scrollTop <= 1000 ? this.$refs.tracklist.scrollTop : 1000
      },
      // 绑定双击方法，用于双击标题栏时页面回到顶部
      onClick() {
        this.counter++
        if (this.counter == 1) {
          this.timer = setTimeout(() => {
            this.counter = 0
          }, 300)
          return
        }
        clearTimeout(this.timer)
        this.counter = 0
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        })
      },
    },
    mounted() {
      this.$nextTick(() => {
        // 获取数据
        function wait(ms) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(ms)
            }, ms)
          })
        }
        this.$spotifyApi.getCategories({ country: "JP", limit: 50, locale: "zh_CN", offset: 0 }, async (err, data) => {
          if (err) {
            console.log(err)
            if (err.status === 401) {
              console.log(401)
              this.$spotifyApi.refreshToken().then(() => {
                this.$router.go()
              })
            }
            return
          }
          // 获得了歌单列表，开始请求歌单
          for (const v of data.categories.items) {
            await wait(50)
            this.$spotifyApi.getCategoryPlaylists(v.id, { country: "JP", limit: 10, offset: 0 }, (err, data) => {
              if (!err) {
                if (!data.playlists.items[0]) return
                data.playlists.name = v.name
                this.listCollection.push(data.playlists)
              }
            })
          }
        })
      })
    },
  }
</script>

<style lang="less" scoped>
  .top {
    padding: 55px 18px 0;
    .welcome {
      font-size: 24px;
      font-weight: 500;
    }
    .icons {
      text-align: right;
    }
  }
  .grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    height: 120px;
    margin: 20px 0;

    .grid-item {
      width: 44%;
      height: 50px;
      display: flex;
      align-items: center;
      gap: 7px;
      justify-content: center;
      background-color: #f2f2f2f9;
      border-radius: 8px;

      &:active {
        background-color: #e6e6e6;
      }
    }
  }
</style>
