<template>
  <div id="home-page">
    <!-- <van-row type="flex" justify="space-between">
      <van-col span="6">晚上好</van-col>
      <van-col span="6"><van-icon name="bullhorn-o" /><van-icon name="clock-o" /><van-icon name="setting-o" /></van-col>
    </van-row> -->
    <van-list ref="list" class="track-list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"> </van-list>
    <div class="grid-container">
      <div class="grid">
        <div class="grid-item" v-for="(item, index) in list" :key="index" @click="go('tracklist', item.id)">
          <van-image :src="item.images[0].url" />
          <p v-html="item.description" class="van-multi-ellipsis--l2"></p>
        </div>
      </div>
      <!-- <button @click="go('tracklist', item.id)">{{ item.name }}{{ item.id }}</button> -->
    </div>
  </div>
</template>

<script>
  export default {
    name: "home-page",
    data() {
      return {
        // list组件参数
        list: [],
        offset: 0,
        loading: false,
        finished: false,
        // 滚动距离
        scrollTop: 0,
      }
    },
    methods: {
      go(dest, playlistId) {
        this.$emit("go", dest, playlistId)
      },
      backward() {
        this.$emit("backward")
      },
      onLoad() {
        console.log(1)
        // 如果没有在使用AccessToken，不执行
        if (!this.$spotifyApi.getAccessToken()) return
        console.log("获取歌曲列表！")
        this.$spotifyApi.getFeaturedPlaylists({ country: "JP", limit: 10, locale: "zh_CN", offset: this.offset }, (err, data) => {
          if (err) {
            console.error(err)
            // 如果token过期
            if (err.status === 401) this.$spotifyApi.goAuth()
            // 刷新token
            this.$spotifyApi.refreshToken()
            // 加载状态结束
            this.loading = false
            return this.$spotifyApi.setAccessToken(null)
          } else {
            // ✅ 成功
            console.log("歌曲列表", data.playlists)
            const playlists = data.playlists
            // 添加数据到数组
            this.list.push(...playlists.items)

            // 加载状态结束
            this.loading = false

            // 请求完后，曲目开始数后移40位
            this.offset += 10
            // 数据全部加载完成
            if (playlists.items.length < 10) {
              console.log("加载了整个列表")
              this.finished = true
            }
          }
        })
      },
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
  }
</script>

<style lang="less" scoped>
  .grid-container {
    width: 100%;
    height: 190px;
    overflow: hidden;
    .grid {
      height: 100%;
      overflow: auto;
      display: flex;
      justify-content: start;
      gap: 20px;
      padding: 0 20px;
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      &::-webkit-scrollbar {
        display: none;
      }
      .grid-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 14px;
        font-weight: 300;

        .van-image {
          width: 140px;
          height: 140px;
        }
      }
    }
  }
</style>
