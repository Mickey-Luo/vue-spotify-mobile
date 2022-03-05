<template>
  <div>
    <van-search @input="input" v-model="searchInput" show-action shape="round" placeholder="请输入搜索关键词" />
    <!-- 搜索结果列表 -->
    <div class="track-list-container">
      <van-list ref="list" class="track-list" v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了" @load="onLoad">
        <!-- 曲目单元 -->
        <van-cell
          class="track-item"
          v-for="item in list"
          v-lazy="item.album.images[1].url"
          :key="item.id"
          clickable
          @click="
            item.preview_url
              ? play({
                  url: item.preview_url,
                  id: item.id,
                  name: item.name,
                  artists: item.artists,
                  album: item.album,
                })
              : ''
          "
        >
          <van-row class="track-item-flexbox" type="flex">
            <!-- 曲目封面 -->
            <div class="play-control">
              <van-col class="track-image">
                <van-image :src="item.album.images[1].url" fit="cover" height="68" width="68"
                  ><template v-slot:loading>
                    <van-loading type="spinner" />
                  </template>
                </van-image>
              </van-col>
              <!-- 圆环 -->
              <van-circle
                v-if="playingId === item.id || inQueueId == item.id"
                :stroke-width="70"
                v-model="currentRate"
                layer-color="#fff"
                color="#1fd760"
                :rate="0"
              >
                <!-- 播放 - 暂停 -->
                <van-icon v-if="!isPlaying && playingId === item.id" name="play" size="27px" color="#1fd760" />
                <van-icon v-if="isPlaying && playingId === item.id" name="pause" size="27px" color="#1fd760" />
                <!-- 加载图标 -->
                <van-loading v-if="playingId === item.id && inQueueId === item.id" />
              </van-circle>
            </div>
            <!-- 曲目信息 -->
            <van-col class="track-detail van-ellipsis" :class="{ unavailable: !item.preview_url }">
              <span class="track-name">{{ item.name }}</span>
              <div class="artist-name-container van-ellipsis">
                <span class="artist-name" v-for="item in item.artists" :key="item.id">
                  {{ item.name }}
                </span>
              </div>
            </van-col>
            <!-- 动作图标 -->
            <van-button @click.stop=";(show = true), showFn(item.name, item.artists, item.album)" round icon="ellipsis"></van-button>
          </van-row>
        </van-cell>
      </van-list>
      <!-- 动作面板 -->
      <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" close-on-click-action safe-area-inset-bottom>
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
    data() {
      return {
        show: false,
        searchInput: "",
        searchValue: "",
        searchQuery: "",
        timer: 0,
        allowSearch: true,
        // list组件参数
        list: [],
        offset: 0,
        loading: false,
        finished: false,
        // 动作面板
        actions: [{ name: "查看专辑", icon: "star-o" }, { name: "查看艺人" }, { name: "添加到歌单" }],
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
      onLoad() {
        this.searchValue = this.searchInput

        if (!this.searchValue) {
          this.list = []
          this.offset = 0
          this.loading = false
          return
        }
        if (this.searchQuery !== this.searchValue) {
          this.list = []
          this.offset = 0
          this.loading = false
        }

        console.log("获取歌曲列表！")
        this.$spotifyApi.search(this.searchValue, ["track", "artist"], { offset: this.offset, limit: 40, include_external: "audio" }, (err, data) => {
          if (err) {
            // ❌ 报错
            // console.error(err)
            // 如果token过期
            // if (err.status === 401) alert("token过期")
            // 获取新token
            this.$spotifyApi.refreshToken()
            // 重新设置token
            this.$spotifyApi.setAccessToken(localStorage.getItem("vue_spotify_token"))

            // 加载状态结束
            this.loading = false
          } else {
            // ✅ 成功

            console.log("歌曲列表", data)

            // 添加歌曲总数到变量
            this.total = data.tracks.total

            // 添加数据到数组
            this.list.push(...data.tracks.items)

            // 加载状态结束
            this.loading = false

            // 请求完成后，保存搜索请求
            this.searchQuery = this.searchValue

            // 请求完后，曲目开始数后移40位
            this.offset += 40
            // 数据全部加载完成
            if (data.length < 40) {
              this.finished = true
            }
          }
        })
      },
      input() {
        // 防抖
        if (this.allowSearch) {
          this.allowSearch = false
          this.timer = setTimeout(() => {
            this.allowSearch = true
            // 空值时不搜索
            this.onLoad()
            clearTimeout(this.timer)
          }, 1000)
        }
      },
      play(order) {
        EventBus.$emit("playOrder", order)
        this.playingId = order.id
        console.log("order:")
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

<style lang="less" scoped>
  .van-search {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 1;
  }
  .track-list-container {
    padding-bottom: 50px;
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
