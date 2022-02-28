<template>
  <div>
    <audio
      ref="audio"
      src="https://p.scdn.co/mp3-preview/faba31300045dcff51050ee0d6a6e2d51b55aed4?cid=e1e7445863f4451b87848d1850d31010"
      preload
      loop
      id="audio"
      controls
      muted
      @timeupdate="timeUpdate"
    ></audio>
    <!-- 音量条 -->
    <p><van-slider v-model="volume" /></p>
  </div>
</template>

<script>
  import EventBus from "../utils/EventBus"
  export default {
    name: "AudioPlayer",
    data() {
      return {
        currentTime: 0,
        defaultVolume: 50,
        playPromise: null,
        isPlaying_local: false,
        showName: "",
        showArtists: [],
        showAlbum: "",
        playingId: "",
        playingName: "",
        playingArtists: [],
        inQueueId: "",
        inQueueUrl: "",
        ready: true
        // 圆环
      }
    },
    computed: {
      isPlaying: {
        get() {
          return this.isPlaying_local
        },
        set(boolean) {
          this.isPlaying_local = boolean
          EventBus.$emit("playState", this.isPlaying_local)
        }
      },
      volume: {
        get() {
          return this.defaultVolume
        },
        set(val) {
          this.$refs.audio.volume = val / 100
          this.defaultVolume = val
        }
      }
    },

    methods: {
      play(url, id) {
        const audio = this.$refs.audio
        // 如果正在播放，

        // 如果点击的是同一首曲子
        if (this.playingId === id) {
          if (this.isPlaying) {
            // 暂停并准备
            audio.pause()
            this.isPlaying = false
          } else {
            this.playPromise = audio.play()
            this.isPlaying = true
          }
        } else {
          // 如果是不同的曲子，先设置inQueueId和Url
          this.inQueueId = id
          this.inQueueUrl = url
          // 如果已经准备好了, 用inQueueId播放
          if (this.ready) {
            this.ready = false
            audio.pause()
            audio.src = this.inQueueUrl
            this.playPromise = audio.play()
            this.playPromise.then(() => {
              // 播放完成后
              this.isPlaying = true
              this.afterPlay()
            })
          }
        }
      },
      afterPlay() {
        const audio = this.$refs.audio
        // 如果有inQueueId，接着播放inQueue
        if (this.inQueueId) {
          audio.src = this.inQueueUrl
          this.playPromise = audio.play()
          this.playPromise.then(() => {
            // 播放完成后准备
            this.playingId = this.inQueueId
            this.inQueueId = ""
            this.inQueueUrl = ""
            this.ready = true
          })
        } else {
          // 没有Queue直接准备
          this.ready = true
          this.playingId = this.inQueueId
        }
      },
      timeUpdate(e) {
        let time = e.target.currentTime * 3.3
        EventBus.$emit("currentTime", time)
      },
      showFn(name, artists, album) {
        this.showName = name
        this.showArtists = artists.map((v) => {
          console.log(v)
          return v.name
        })
        this.showAlbum = album
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.$refs.audio.volume = this.defaultVolume / 100
      })
      EventBus.$on("playOrder", (order) => {
        console.log(order)
        this.play(order.url, order.id)
      })
    }
  }
</script>

<style>
  .van-slider {
    position: fixed;
    bottom: 60px;
    left: 0;
    z-index: 2026;
  }
</style>
