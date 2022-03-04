<template>
  <div>
    <div class="grid-container">
      <div class="grid">
        <div class="grid-item" v-for="(item, index) in list" :key="index" @click="go('tracklist', item.id)">
          <van-image :src="item.images[0].url" />
          <p v-html="item.description" class="van-multi-ellipsis--l2"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "list-scroll",
    data() {
      return {
        // list组件参数
        list: [],
        offset: 0,
        loading: false,
        finished: false,
      }
    },
    methods: {
      go(dest, playlistId) {
        this.$emit("go", dest, playlistId)
      },
      backward() {
        this.$emit("backward")
      },
    },
    mounted() {
      this.$nextTick(() => {
        // 如果没有在使用AccessToken，不执行
        if (!this.$spotifyApi.getAccessToken()) return
        // 定义回调函数
        const callback = (err, data) => {
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
        }
        console.log("获取歌单列表！")
        this.$spotifyApi.getFeaturedPlaylists({ country: "JP", limit: 10, locale: "zh_CN", offset: this.offset }, callback)
      })
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
      gap: 15px;
      padding: 0 15px;
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
