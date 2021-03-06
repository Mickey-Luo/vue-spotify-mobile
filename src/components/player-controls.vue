<template>
  <div
    id="player-controls"
    ref="panel"
    :style="{
      zIndex: distance || expanded ? 2042 : 1,
    }"
  >
    <!-- 小面板 -->
    <div class="mini" ref="mini" @click.prevent.stop="expanded ? '' : expand()" @touchstart="touchStart" @touchmove.prevent="drag" @touchend="touchEnd">
      <div class="track-cover">
        <img :src="Object.keys(state.album).length !== 0 ? state.album.images[1].url : ''" v-show="Object.keys(state.album).length !== 0" />
      </div>
      <!-- 曲名/艺人名 -->
      <div class="track-detail">
        <div class="container" ref="mini_detail" @touchstart="mini_touchStart" @touchmove.prevent="mini_drag" @touchend="mini_touchEnd">
          <div class="track-detail-item">
            <p class="name van-ellipsis">{{ prevTrack.name }}</p>
            <p class="artists van-ellipsis">
              {{ prevTrack.artists.join(" · ") }}
            </p>
          </div>
          <div class="track-detail-item">
            <p class="name van-ellipsis">{{ state.name }}</p>
            <p class="artists van-ellipsis">{{ state.artists.join(" · ") }}</p>
          </div>
          <div class="track-detail-item">
            <p class="name van-ellipsis">{{ nextTrack.name }}</p>
            <p class="artists van-ellipsis">
              {{ nextTrack.artists.join(" · ") }}
            </p>
          </div>
        </div>
      </div>
      <div class="play-button">
        <van-icon v-if="!state.isPlaying" @click.stop="!state.url || expanded ? '' : play()" name="play" size="28px" />
        <van-icon v-if="state.isPlaying" @click.stop="!state.url || expanded ? '' : pause()" name="pause" size="28x" />
      </div>
      <div class="progress">
        <van-progress :percentage="currentRate" color="#1fd760" track-color="#999" :show-pivot="false" />
      </div>
    </div>
    <!-- 大面板 -->
    <div class="large" ref="large" @click.stop="expanded ? '' : expand()" @touchstart="touchStart" @touchmove.prevent="drag" @touchend="touchEnd">
      <van-nav-bar :title="state.listName">
        <template #left>
          <van-icon name="arrow-down" size="18" @click.stop="close" />
        </template>
      </van-nav-bar>
      <div class="container">
        <div class="track-cover">
          <img :src="Object.keys(state.album).length !== 0 ? state.album.images[1].url : ''" v-show="Object.keys(state.album).length !== 0" />
        </div>
        <div class="sub-container">
          <div class="track-detail" ref="detail">
            <p class="name van-ellipsis">{{ state.name }}</p>
            <p class="artists van-ellipsis">{{ state.artists.join(" · ") }}</p>
          </div>
          <div class="progress">
            <van-progress :percentage="currentRate" color="#1fd760" track-color="#999" stroke-width="4" :show-pivot="false" />
          </div>
          <div class="play-button">
            <van-icon name="arrow-left" size="54" @click.stop="prev" />
            <van-icon v-if="!state.isPlaying" @click.stop="!state.url || play()" name="play-circle-o" size="54" />
            <van-icon v-if="state.isPlaying" @click.stop="!state.url || pause()" name="pause-circle-o" size="54" />
            <van-icon name="arrow" @click.stop="next" size="54" />
          </div>
        </div>
      </div>
    </div>
    <audio-player ref="player" @currentRate="getRate"></audio-player>
  </div>
</template>

<script>
  import EventBus from "../utils/EventBus.js"
  import AudioPlayer from "@/components/audio-player.vue"
  import { gsap } from "gsap"

  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
  }
  export default {
    name: "player-controls",
    components: {
      "audio-player": AudioPlayer,
    },
    data() {
      return {
        currentRate: 0,
        state: {
          url: "",
          id: "",
          name: "欢迎使用Vant-Spotify",
          artists: ["by Mickey-Luo@Github"],
          album: {},
          isPlaying: false,
          listName: "",
          list: [],
        },
        prevTrack: {
          url: "",
          id: "",
          name: "",
          artists: [],
          album: {},
          index: 0,
        },
        nextTrack: {
          url: "",
          id: "",
          name: "",
          artists: [],
          album: {},
          index: 0,
        },
        // sliding
        direction: null,
        // mini
        miniDistance: null,
        miniOffsetWidth: null,
        originalOffsetX: null,
        nowOffsetX: null,
        touchStartX: null,
        // large
        panelY: null,
        touchStartY: null,
        originalHeight: null,
        nowHeight: null,
        distance: 0,
        expanded: false,
      }
    },
    computed: {},
    methods: {
      play() {
        this.isPlaying = true
        this.$refs.player.play(this.state.url, this.state.id)
      },
      pause() {
        this.isPlaying = false
        this.$refs.player.play(this.state.url, this.state.id)
      },
      prev() {
        this.$refs.player.prev()
      },
      next() {
        this.$refs.player.next()
      },
      getRate(val) {
        this.currentRate = val
      },
      // mini
      mini_touchStart(e) {
        console.log(e)
        console.dir(this.$refs.mini_detail)
        this.miniOffsetWidth || (this.miniOffsetWidth = this.$refs.mini_detail.offsetWidth)
        this.touchStartX = e.touches[0].pageX
        if (this.originalOffsetX === null) {
          this.originalOffsetX = this.$refs.mini_detail.offsetLeft
        }
        this.nowOffsetX = this.$refs.panel.offsetHeight
      },
      mini_drag(e) {
        // 如果已经在做竖向滑动，跳出
        if (this.direction === "v") return
        // 获取参数
        let detail = this.$refs.mini_detail
        this.miniDistance = e.touches[0].pageX - this.touchStartX
        // 改变 direction
        // console.log({ miniDistance: this.miniDistance, distance: this.distance })
        let md = Math.abs(this.miniDistance),
          ld = Math.abs(this.distance)
        let range = 5
        // 如果：滑动超过range，而横向大于竖向，或者已经是横向
        if (this.direction === "h" || ((md > range || ld > range) && md > ld)) {
          // 触发横向
          this.direction = "h"
        }
        // 如果：滑动超过range，且竖向大于横向
        else if ((md > range || ld > range) && md < ld) {
          // 触发竖向并跳出
          this.direction = "v"
          return
        }
        // 在触发前不进行动画
        else return

        gsap.set(detail, { x: this.miniDistance })
      },
      mini_touchEnd() {
        this.direction = null
        let detail = this.$refs.mini_detail
        if (this.miniDistance > 80) {
          gsap.to(detail, { x: this.miniOffsetWidth })
          setTimeout(() => {
            this.prev()
          }, 500)
        } else if (this.miniDistance < -80) {
          gsap.to(detail, { x: -this.miniOffsetWidth })
          setTimeout(() => {
            this.next()
          }, 500)
        } else {
          gsap.to(detail, { x: 0 })
        }
        this.miniDistance = 0
      },
      // large
      touchStart(e) {
        this.touchStartY = e.touches[0].pageY
        if (this.originalHeight === null) {
          this.originalHeight = this.$refs.panel.offsetHeight
          this.originalTop = this.$refs.panel.offsetTop
        }
        this.nowHeight = this.$refs.panel.offsetHeight
      },

      drag(e) {
        if (this.direction === "h") return
        let tabbar = this.$parent.$refs.tabbar.$el
        let panel = this.$refs.panel
        let mini = this.$refs.mini
        let large = this.$refs.large
        this.distance = e.touches[0].pageY - this.touchStartY
        let percentage = (panel.offsetHeight - this.originalHeight) / (window.innerHeight - this.originalHeight)
        // panel超出屏幕时跳出
        // 从下方的情况
        if (!this.expanded) {
          if (this.distance > 0) {
            this.distance = 0
          } else if (-this.distance > this.originalTop) {
            this.distance = this.originalTop
          }
        } else {
          // 从上方的情况
          if (this.distance < 0) {
            this.distance = 0
          } else if (this.distance > this.originalTop) {
            this.distance = this.originalTop
          }
        }

        // 触摸起始点当超过封面下方时不被拖动
        if (this.expanded && this.touchStartY > this.$refs.detail.offsetTop) return
        // gsap
        gsap.set(panel, {
          backgroundColor: "rgba(240,240,240," + easeOutExpo(percentage) + ")",
        })
        gsap.set(mini, { opacity: 1 - easeOutExpo(percentage) })
        gsap.set(large, { opacity: easeOutExpo(percentage) })
        gsap.set(panel, { height: this.nowHeight - this.distance })
        gsap.set(tabbar, { y: tabbar.offsetHeight * percentage })
      },
      touchEnd() {
        if (this.expanded) {
          if (this.distance >= 120) {
            // 关
            this.close()
          } else {
            // 开
            this.expand()
          }
        } else {
          if (-this.distance >= 120) {
            // 开
            this.expand()
          } else {
            // 关
            this.close()
          }
        }
        this.distance = null
      },
      expand() {
        let tabbar = this.$parent.$refs.tabbar.$el
        let panel = this.$refs.panel
        let mini = this.$refs.mini
        let large = this.$refs.large
        gsap.to(panel, {
          height: "100%",
          backgroundColor: "rgba(240,240,240,1)",
        })
        gsap.to(mini, { opacity: 0 })
        gsap.to(large, { opacity: 1 })
        gsap.to(tabbar, { y: tabbar.offsetHeight })

        this.expanded = true
      },
      close() {
        let tabbar = this.$parent.$refs.tabbar.$el
        let panel = this.$refs.panel
        let mini = this.$refs.mini
        let large = this.$refs.large
        gsap.to(panel, { backgroundColor: "rgba(240,240,240,0)" })
        gsap.to(panel, {
          height: this.originalHeight,
          backgroundColor: "rgba(240,240,240,0)",
        })
        gsap.to(mini, { opacity: 1 })
        gsap.to(large, { opacity: 0 })
        gsap.to(tabbar, { y: 0 })

        this.expanded = false
      },
    },
    mounted() {
      EventBus.$on("playState", (state, prevTrack, nextTrack) => {
        console.log(state)
        let detail = this.$refs.mini_detail
        gsap.set(detail, { x: 0 })
        this.state = { ...state }
        this.prevTrack = { ...prevTrack }
        this.nextTrack = { ...nextTrack }
      })
    },
  }
</script>

<style lang="less" scoped>
  #player-controls {
    width: 100%;
    height: 120px;
    position: fixed;
    bottom: 0;
    z-index: 1;
    .mini {
      position: absolute;
      z-index: 1;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      box-sizing: border-box;
      // overflow: hidden;
      margin: 0 auto;
      padding: 0px 8px;
      width: 100%;
      max-width: 92%;
      height: 54px;
      background-color: #f2f2f2f9;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      & * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .track-cover {
        height: 38px;
        width: 38px;
        margin-right: 2px;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .track-detail {
        flex: 1;
        max-width: 75%;
        height: 48px;
        padding: 5px 0;
        overflow: hidden;
        .container {
          display: flex;
          justify-content: center;
          height: 100%;
          & .track-detail-item {
            width: 100%;
            flex-shrink: 0;
            .name {
              font-size: 14px;
              line-height: 14px;
              margin-bottom: 4px;
            }
            .artists {
              font-weight: 300;
              font-size: 12px;
              line-height: 12px;
            }
          }
        }
      }
      .play-button {
        width: 31px;
      }
      .progress {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -2px;
        width: 95.2%;
      }
    }
    // 大面板
    .large {
      opacity: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      .van-nav-bar {
        background-color: #fff0;
      }
      .container {
        flex: 1;
        width: 85%;
        height: calc(100%-60px);
        margin: 25px auto;
        .track-cover {
          width: 85vw;
          height: 85vw;
          background-color: #fff;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .sub-container {
          // flex: 1;
          .track-detail {
            height: 38px;
            margin: 48px 0 26px 0;
            .name {
              font-size: 24px;
              line-height: 32px;
            }
            .artists {
              font-weight: 300;
              font-size: 14px;
              line-height: 18px;
            }
          }
          .progress {
            width: 100%;
          }
          .play-button {
            display: flex;
            justify-content: center;
            gap: 25px;
            width: 80px;
            margin: 30px auto 0;
            text-align: center;
            .van-icon:active {
              transform: scale(0.98);
            }
          }
        }
      }
    }
  }
</style>
