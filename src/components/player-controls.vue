<template>
  <div
    id="player-controls"
    ref="panel"
    :style="{
      zIndex: distance || expanded ? 2042 : 1,
    }"
  >
    <!-- 小面板 -->
    <div class="mini" ref="mini" @click.prevent.stop="expanded ? '' : expand()" @touchstart="touchStart" @touchmove.prevent.stop="drag" @touchend="touchEnd">
      <div class="track-cover">
        <img :src="Object.keys(state.album).length !== 0 ? state.album.images[1].url : ''" v-show="Object.keys(state.album).length !== 0" />
      </div>
      <div class="track-detail">
        <p class="name van-ellipsis">{{ state.name }}</p>
        <p class="artists van-ellipsis">{{ state.artists.join(" · ") }}</p>
      </div>
      <div class="play-button">
        <van-icon v-if="!state.isPlaying" @click.stop="expanded ? '' : play()" name="play" size="28px" />
        <van-icon v-if="state.isPlaying" @click.stop="expanded ? '' : pause()" name="pause" size="28x" />
      </div>
      <div class="progress">
        <van-progress :percentage="currentRate" color="#1fd760" :show-pivot="false" />
      </div>
    </div>
    <!-- 大面板 -->
    <div class="large" ref="large">
      <van-nav-bar title="Spotify">
        <template #left>
          <van-icon name="arrow-down" size="18" @click="close" />
        </template>
      </van-nav-bar>
      <div class="container">
        <h2></h2>
        <div class="track-cover">
          <img :src="Object.keys(state.album).length !== 0 ? state.album.images[1].url : ''" v-show="Object.keys(state.album).length !== 0" />
        </div>
        <div class="track-detail">
          <p class="name van-ellipsis">{{ state.name }}</p>
          <p class="artists van-ellipsis">{{ state.artists.join(" · ") }}</p>
        </div>
        <div class="progress">
          <van-progress :percentage="currentRate" color="#1fd760" stroke-width="8" :show-pivot="false" />
        </div>
        <div class="play-button">
          <van-icon name="arrow-left" size="58" />
          <van-icon v-if="!state.isPlaying" @click.stop="play" name="play-circle-o" size="58" />
          <van-icon v-if="state.isPlaying" @click.stop="pause" name="pause-circle-o" size="58" />
          <van-icon name="arrow" size="58" />
        </div>
      </div>
    </div>
    <audio-player ref="player" @currentRate="getRate" @playState="playState"></audio-player>
  </div>
</template>

<script>
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
        },
        panelY: null,
        originalHeight: null,
        nowHeight: null,
        distance: 0,
        expanded: false,
      }
    },
    mounted() {},
    computed: {},
    methods: {
      playState(state) {
        this.state = { ...state }
      },
      play() {
        this.isPlaying = true
        this.$refs.player.play(this.state.url, this.state.id)
      },
      pause() {
        this.isPlaying = false
        this.$refs.player.play(this.state.url, this.state.id)
      },
      getRate(val) {
        this.currentRate = val
      },
      touchStart(e) {
        this.touchStartY = e.touches[0].pageY
        if (this.originalHeight === null) {
          this.originalHeight = this.$refs.panel.offsetHeight
        }
        this.nowHeight = this.$refs.panel.offsetHeight
      },
      drag(e) {
        let panel = this.$refs.panel
        let mini = this.$refs.mini
        let large = this.$refs.large
        this.distance = e.touches[0].pageY - this.touchStartY
        let percentage = (panel.offsetHeight - this.originalHeight) / (window.innerHeight - this.originalHeight)
        // if (panel.offsetHeight - this.originalHeight <= 0) return

        // gsap
        gsap.set(panel, { backgroundColor: "rgba(240,240,240," + easeOutExpo(percentage) + ")" })
        gsap.set(mini, { opacity: 1 - percentage })
        gsap.set(large, { opacity: percentage })
        gsap.set(panel, { height: this.nowHeight - this.distance })
      },
      touchEnd() {
        if (this.expanded) {
          if (this.distance >= 130) {
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
        let panel = this.$refs.panel
        let mini = this.$refs.mini
        let large = this.$refs.large
        gsap.to(panel, { height: "100%", backgroundColor: "rgba(240,240,240,1)" })
        gsap.to(mini, { opacity: 0 })
        gsap.to(large, { opacity: 1 })
        this.expanded = true
      },
      close() {
        let panel = this.$refs.panel
        let mini = this.$refs.mini
        let large = this.$refs.large
        gsap.to(panel, { backgroundColor: "rgba(240,240,240,0)", ease: "expo.in" })
        gsap.to(panel, { height: this.originalHeight, backgroundColor: "rgba(240,240,240,0)" })
        gsap.to(mini, { opacity: 1 })
        gsap.to(large, { opacity: 0 })
        this.expanded = false
      },
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
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
      margin: 0 auto;
      padding: 4px 8px;
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
        height: 38px;
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
      .play-button {
        width: 31px;
      }
      .progress {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
      }
    }
    // 大面板
    .large {
      opacity: 0;
      .van-nav-bar {
        background-color: #fff0;
      }
      .container {
        width: 92%;
        margin: 0 auto;
        .track-cover {
          width: 92vw;
          height: 92vw;
          margin: 40px auto 0;
          background-color: #fff;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .track-detail {
          height: 38px;
          margin: 22px 0;
          .name {
            font-size: 24px;
            line-height: 32px;
            margin-bottom: 4px;
          }
          .artists {
            font-weight: 300;
            font-size: 18px;
            line-height: 18px;
          }
        }
        .progress {
          width: 100%;
          margin-top: 40px;
        }
        .play-button {
          display: flex;
          justify-content: center;
          gap: 25px;
          width: 80px;
          margin: 30px auto 0;
          text-align: center;
        }
      }
    }
  }
</style>
