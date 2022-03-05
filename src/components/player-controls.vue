<template>
  <div
    id="player-controls"
    ref="panel"
    :style="{
      zIndex: distance !== null || expanded ? 4 : 0,
    }"
  >
    <div class="track" ref="mini" @click="expanded ? '' : expand()" @touchstart="touchStart" @touchmove.prevent.stop="drag" @touchend="touchEnd">
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

    <audio-player ref="player" @currentRate="getRate" @playState="playState"></audio-player>
  </div>
</template>

<script>
  import AudioPlayer from "@/components/audio-player.vue"
  // GSAP
  import { gsap } from "gsap"

  // const easeOutCir = (x) => {
  //   return Math.sqrt(1 - Math.pow(x - 1, 2))
  // }
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
        this.distance = e.touches[0].pageY - this.touchStartY
        let percentage = (panel.offsetHeight - this.originalHeight) / (window.innerHeight - this.originalHeight)

        // console.log({ window: window.innerHeight, panelOffset: panel.offsetHeight, originalHeight: this.originalHeight })
        // console.log({ touchStartY: this.touchStartY })
        console.log({ percentage: percentage })
        console.log({ distance: this.distance })
        // if (this.distance > 0 || -this.distance > window.innerHeight - this.originalHeight) return
        gsap.set(panel, { backgroundColor: "rgba(240,240,240," + easeOutExpo(percentage) + ")" })
        gsap.set(mini, { opacity: 1 - percentage })
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
        gsap.to(panel, { height: "100%", backgroundColor: "rgba(240,240,240,1)" })
        gsap.to(mini, { opacity: 0 })
        this.expanded = true
      },
      close() {
        let panel = this.$refs.panel
        let mini = this.$refs.mini
        gsap.to(panel, { backgroundColor: "rgba(240,240,240,0)", ease: "expo.in" })
        gsap.to(panel, { height: this.originalHeight, backgroundColor: "rgba(240,240,240,0)" })
        gsap.to(mini, { opacity: 1 })
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
    .track {
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
  }
</style>
