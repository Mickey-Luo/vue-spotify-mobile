<template>
  <div ref="tracklist" id="tracklist" @scroll="scroll">
    <!-- 标题栏1 -->
    <van-nav-bar class="fixed-nav" left-arrow @click-left="backward" />
    <!-- 标题栏2 -->
    <van-sticky>
      <van-nav-bar ref="bar" :border="false" left-arrow @click-left="backward" :style="{ opacity: scrollTop > 1000 ? 1 : scrollTop / 250 }">
        <template #title>
          <p
            @click="onClick"
            :style="{
              opacity: (scrollTop - 100) / 50,
              transform: scrollTop > 1000 ? 'none' : 'translateY(' + 80 / (scrollTop - 120) + 'px)',
            }"
          >
            {{ listName }}
          </p>
        </template></van-nav-bar
      >
    </van-sticky>
    <!-- 搜索框 -->
    <van-search v-model="searchValue" show-action shape="round" placeholder="请输入搜索关键词" :style="{ opacity: 1 - (scrollTop - 5) / 25 }">
      <template #action>
        <div>排序</div>
      </template>
    </van-search>
    <!-- 歌单信息 -->
    <div class="page-title" :style="{ opacity: 1.1 - (scrollTop - 50) / 80 }">
      <h2>{{ listName }}</h2>
      <p>{{ total.toLocaleString() }} 首歌曲</p>
    </div>
    <!-- 歌单 list -->
    <div class="track-list-container">
      <van-list ref="list" class="track-list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- 曲目单元 -->
        <van-cell
          class="track-item"
          v-for="(item, index) in list"
          v-lazy="item.track.album.images[1].url"
          :key="item.track.id"
          clickable
          @click="
            item.track.preview_url
              ? play({
                  url: item.track.preview_url,
                  id: item.track.id,
                  name: item.track.name,
                  artists: item.track.artists,
                  album: item.track.album,
                  list: list,
                  index: index,
                })
              : ''
          "
        >
          <van-row class="track-item-flexbox" type="flex">
            <!-- 曲目封面 -->
            <div class="play-control">
              <van-col class="track-image">
                <van-image :src="item.track.album.images[1].url" fit="cover" height="68" width="68"
                  ><template v-slot:loading>
                    <van-loading type="spinner" />
                  </template>
                </van-image>
              </van-col>
              <!-- 圆环 -->
              <van-circle
                v-if="playingId === item.track.id || inQueueId == item.track.id"
                :stroke-width="70"
                v-model="currentRate"
                layer-color="#fff"
                color="#1fd760"
                :rate="0"
              >
                <!-- 播放 - 暂停 -->
                <van-icon v-if="isPlaying || playingId === item.track.id" :name="isPlaying ? 'pause' : 'play'" size="27px" color="#1fd760" />
                <!-- 加载图标 -->
                <van-loading v-if="playingId === item.track.id && inQueueId === item.track.id" />
              </van-circle>
            </div>
            <!-- 曲目信息 -->
            <van-col class="track-detail van-ellipsis" :class="{ unavailable: !item.track.preview_url }">
              <span class="track-name">{{ item.track.name }}</span>
              <div class="artist-name-container van-ellipsis">
                <span class="artist-name" v-for="item in item.track.artists" :key="item.id">
                  {{ item.name }}
                </span>
              </div>
            </van-col>
            <!-- 动作图标 -->
            <van-button @click.stop=";(show = true), showFn(item.track.name, item.track.artists, item.track.album)" round icon="ellipsis"></van-button>
          </van-row>
        </van-cell>
      </van-list>
      <!-- 动作面板 -->
      <van-action-sheet v-model="show" :actions="actions" @select="onSelect" cancel-text="取消" close-on-click-action safe-area-inset-bottom>
        <template #description>
          <p></p>
          <van-image :src="showAlbum && showAlbum.images[0].url" fit="cover" height="256" width="256"
            ><template v-slot:loading>
              <van-loading type="spinner" />
            </template>
          </van-image>
          <h2>{{ showName }}</h2>
          <p>{{ showArtists.join(" · ") }}</p>
        </template></van-action-sheet
      >
    </div>
  </div>
</template>

<script>
  import EventBus from "../utils/EventBus"
  export default {
    name: "tracklist",
    props: {
      playlistId: {
        type: String,
      },
    },
    data() {
      return {
        // list组件
        list: [],
        offset: 0,
        loading: false,
        finished: false,
        // 滚动距离
        scrollTop: 0,
        // 动作面板
        show: false,
        actions: [{ name: "查看专辑", icon: "star-o" }, { name: "查看艺人" }, { name: "添加到歌单" }],
        // 搜索栏
        searchValue: "",
        // 歌单信息
        total: 0,
        // 双击标题返回
        counter: 0,
        timer: 0,
        // 列表相关
        listName: "",
        // 播放相关
        currentRate: 0,
        defaultVolume: 50,
        isPlaying: false,
        showName: "",
        showArtists: [],
        showAlbum: "",
        playingId: "",
        playingName: "",
        playingArtists: [],
        inQueueId: "",
        inQueueUrl: "",
        ready: true,
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
      onSelect(item) {
        console.log(item)
      },
      onLoad() {
        // 如果没有在使用AccessToken，不执行
        if (!this.$spotifyApi.getAccessToken()) return
        console.log("获取歌曲列表！")
        this.$spotifyApi.getMySavedTracks({}, (err, data) => {
          if (err) {
            // ❌ 报错
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
            console.log("歌曲列表", data)
            const tracks = data.tracks

            // 拿到歌名
            this.listName = data.name

            // 添加歌曲总数到变量
            this.total = tracks.total

            // 添加数据到数组
            this.list.push(...tracks.items)

            // 加载状态结束
            this.loading = false

            // 请求完后，曲目开始数后移40位
            this.offset += 40
            // 数据全部加载完成
            if (this.list.length >= this.total) {
              console.log(1)
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
      play(order) {
        EventBus.$emit("playOrder", order)
        this.playingId = order.id
        console.log("order")
        console.log(order)
      },
      showFn(name, artists, album) {
        this.showName = name
        this.showArtists = artists.map((v) => {
          return v.name
        })
        this.showAlbum = album
      },
    },
    mounted() {
      // 获得圆环进度
      EventBus.$on("currentRate", (time) => {
        this.currentRate = time
      })
      // 获得播放状态
      EventBus.$on("playState", (isPlaying) => {
        this.isPlaying = isPlaying
      })
      // 获得等待播放曲目
      EventBus.$on("queue", (id) => {
        this.inQueueId = id
      })
    },
  }
</script>

<style lang="less">
  .page-title {
    & > * {
      box-sizing: border-box;
      margin: 16px 16px;
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
    padding: 0 0 70px 0;
    .track-list {
      .track-item {
        padding-top: 6px;
        padding-bottom: 6px;
        height: 80px;
        .track-item-flexbox {
          flex-wrap: nowrap;

          height: 68px;
          .play-control {
            position: relative;
            .van-circle {
              position: absolute;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 68px;
              height: 68px;
              background-color: #0006;
              svg {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 48px;
                height: 48px;
              }
            }

            .van-icon {
              position: absolute;
            }
          }

          .track-detail {
            padding-left: 10px;
            flex: 1;
            &.unavailable {
              color: #aaa;
            }
            .track-name {
              font-weight: 500;
              line-height: 17px;
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
            background-color: #fff0;
          }
        }
      }
      .van-action-sheet {
        h2,
        p {
          color: #000;
        }
        max-height: 90%;
        .van-action-sheet__item {
          height: 60px;
        }
        .van-action-sheet__cancel {
          height: 60px;
        }
      }
    }
  }
</style>
