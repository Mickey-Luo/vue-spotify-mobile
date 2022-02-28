<template>
  <div id="home">
    <!-- <van-row type="flex" justify="space-between">
      <van-col span="6">晚上好</van-col>
      <van-col span="6"
        ><van-icon name="bullhorn-o" /><van-icon name="clock-o" /><van-icon name="setting-o"
      /></van-col>
    </van-row> -->
    <!-- 标题栏1 -->
    <van-nav-bar class="fixed-nav" left-arrow />
    <!-- 标题栏2 -->
    <van-sticky @scroll="scroll">
      <van-nav-bar class="" :border="false" left-arrow :style="{ opacity: scrollTop / 250 }">
        <template #title>
          <p
            @click="onClick"
            :style="{
              opacity: (scrollTop - 150) / 50,
              transform: 'translateY(' + 80 / (scrollTop - 150) + 'px)'
            }"
          >
            已点赞的歌曲
          </p>
        </template></van-nav-bar
      >
    </van-sticky>
    <!-- 搜索框 -->
    <van-search
      v-model="searchValue"
      show-action
      shape="round"
      placeholder="请输入搜索关键词"
      :style="{ opacity: 1 - (scrollTop - 5) / 25 }"
    >
      <template #action>
        <!-- <div @click="onSearch">搜索</div> -->
        <div>排序</div>
      </template>
    </van-search>
    <!-- 歌单信息 -->
    <div class="page-title" :style="{ opacity: 1.1 - (scrollTop - 50) / 80 }">
      <h2>已点赞的歌曲</h2>
      <p>{{ total.toLocaleString() }} 首歌曲</p>
    </div>
    <!-- <van-empty
      description="占位图：还没做好"
      :style="{ opacity: 1 - scrollTop / 250 }"
      image-size="50px"
    /> -->
    <!-- 播放器 -->
    <audio
      ref="audio"
      src="https://p.scdn.co/mp3-preview/faba31300045dcff51050ee0d6a6e2d51b55aed4?cid=e1e7445863f4451b87848d1850d31010"
      preload
      loop
      id="audio"
      muted
      @timeupdate="timeupdate"
    ></audio>
    <!-- 音量条 -->
    <p><van-slider v-model="volume" /></p>
    <!-- 曲目列表 -->
    <div class="track-list-container">
      <van-list
        ref="list"
        class="track-list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 曲目单元 -->
        <van-cell
          class="track-item"
          v-for="item in list"
          v-lazy="item.track.album.images[1].url"
          :key="item.track.id"
          @click="play(item.track.preview_url, item.track.id)"
        >
          <van-row class="track-item-flexbox" type="flex">
            <!-- 曲目封面 -->
            <div class="play-control">
              <van-col class="track-image">
                <van-image :src="item.track.album.images[1].url" fit="cover" height="68" width="68"
                  ><template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </van-col>

              <van-circle
                :style="{
                  visibility: isPlaying && playingId === item.track.id ? 'visible' : 'hidden'
                }"
                :stroke-width="60"
                v-model="currentTime"
                layer-color="#fff"
                color="#1fd760"
                :rate="100"
              >
                <!-- 暂停 -->
                <van-icon name="pause" size="27px" color="#1fd760" />
              </van-circle>
            </div>
            <!-- 曲目信息 -->
            <van-col class="track-detail van-ellipsis">
              <span class="track-name">{{ item.track.name }}</span>
              <div class="artist-name-container van-ellipsis">
                <span class="artist-name" v-for="item in item.track.artists" :key="item.id">
                  {{ item.name }}
                </span>
              </div>
            </van-col>
            <!-- 小图标 -->
            <van-button @click="show = true" round icon="ellipsis"></van-button>
          </van-row>
        </van-cell>
        <van-action-sheet
          v-model="show"
          :actions="actions"
          cancel-text="取消"
          description="这是一段描述信息"
          close-on-click-action
        />
      </van-list>
    </div>
  </div>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        mySavedTracks: {},
        list: [],
        offset: 0,
        // list组件参数
        loading: false,
        finished: false,
        // 滚动距离
        scrollTop: 0,
        show: false,
        actions: [{ name: "选项一" }, { name: "选项二" }, { name: "选项三" }],
        searchValue: "",
        total: 0,
        counter: 0,
        // 进度圈
        currentRate: 0,
        isPlaying: false,
        playingId: "",
        currentTime: 0,
        defaultVolume: 50
      }
    },
    methods: {
      onLoad() {
        // 异步获取歌曲列表
        console.log(this.$refs.list)

        console.log("获取歌曲列表！")
        this.$spotifyApi.getMySavedTracks({ offset: this.offset, limit: 40 }, (err, data) => {
          if (err) {
            // ❌ 报错
            // console.error(err)
            // 如果token过期
            // if (err.status === 401) alert("token过期")
            // 获取新token
            this.$spotifyApi.refreshToken()
            // 重新设置token
            this.$spotifyApi.setAccessToken(localStorage.getItem("vant_spotify_token"))

            // 加载状态结束
            this.loading = false
          } else {
            // ✅ 成功
            console.log("歌曲列表", data)

            // 添加歌曲总数到变量
            this.total = data.total

            // 添加数据到数组
            this.list.push(...data.items)

            // 加载状态结束
            this.loading = false
            
            // 请求完后，曲目开始数后移40位
            this.offset += 40
            // 数据全部加载完成
            if (data.length < 2) {
              this.finished = true
            }
          }
        })
      },
      scroll(e) {
        this.scrollTop = e.scrollTop
      },
      // 绑定双击方法
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
          behavior: "smooth"
        })
      },
      play(url, id) {
        if (this.isPlaying && this.playingId === id) {
          this.$refs.audio.pause()
          return (this.isPlaying = false)
        }
        this.$refs.audio.src = url
        this.$refs.audio.play()
        this.playingId = id
        this.isPlaying = true
      },
      timeupdate(e) {
        // console.log(e)
        this.currentTime = e.target.currentTime * 3.3
      }
    },
    mounted() {
      this.$refs.audio.volume = 0.5
    },
    computed: {
      volume: {
        get() {
          return this.defaultVolume
        },
        set(val) {
          this.$refs.audio.volume = val / 100
          this.defaultVolume = val
        }
      }
    }
  }
</script>

<style lang="less">
  .page-title {
    & > * {
      margin: 10px 0;
      box-sizing: border-box;
      margin: 0 14px;
    }
    p {
      color: #666;
      font-size: 14px;
    }
  }
  .fixed-nav {
    position: fixed;
    top: 0;
  }
  .van-nav-bar {
    height: 60px;
    .van-nav-bar__content {
      height: 60px;
    }
  }
  .track-list-container {
    padding-bottom: 50px;
  }
  .track-list {
    .track-item {
      padding-top: 6px;
      padding-bottom: 6px;
      height: 80px;
      .track-item-flexbox {
        flex-wrap: nowrap;
        // .track-image {
        //   width: 70px;
        // }
        height: 68px;
        .play-control {
          position: relative;
          .van-circle {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 68px;
            height: 68px;
            background-color: #0008;
          }
          .van-image,
          .van-icon {
            position: absolute;
          }
        }

        .track-detail {
          padding-left: 14px;
          flex: 1;
          .track-name {
            font-weight: 500;
          }
          .artist-name-container {
            opacity: 0.6;
            .artist-name + .artist-name::before {
              content: "·";
            }
          }
        }
        .van-button {
          align-self: center;
          border: none;
          height: 48px;
          width: 48px;
        }
      }
    }
  }
</style>
