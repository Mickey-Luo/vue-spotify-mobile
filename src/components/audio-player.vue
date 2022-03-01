<template>
  <div>
    <audio ref="audio" src="" preload loop id="audio" muted @timeupdate="timeUpdate"></audio>
    <!-- 音量条 -->
    <!-- <p><van-slider v-model="volume" /></p> -->
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
        playingId_local: "",
        playingName_local: "Vue-Spotify-Mobile",
        playingUrl_local: "",
        playingArtists_local: [],
        playingAlbum_local: [],
        inQueueId_local: "",
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
          EventBus.$emit("playState", boolean)
          this.$nextTick(() => {
            this.$emit("playState", {
              url: this.playingUrl_local,
              id: this.playingId_local,
              name: this.playingName_local,
              artists: this.playingArtists_local,
              isPlaying: this.isPlaying_local
            })
          })
        }
      },
      inQueueId: {
        get() {
          return this.inQueueId_local
        },
        set(id) {
          this.inQueueId_local = id
          EventBus.$emit("queue", id)
        }
      },
      // note: 可能要清除的代码,命名也可以精简
      playingName: {
        get() {
          return this.playingName_local
        },
        set(val) {
          this.playingName_local = val
        }
      },
      playingId: {
        get() {
          return this.playingId_local
        },
        set(val) {
          this.playingId_local = val
        }
      },
      playingUrl: {
        get() {
          return this.playingUrl_local
        },
        set(val) {
          this.playingUrl_local = val
        }
      },
      playingArtists: {
        get() {
          return this.playingArtists_local
        },
        set(arr) {
          this.playingArtists_local = arr
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
      play(url, id, name, artists) {
        const audio = this.$refs.audio
        // 如果点击的是同一首曲子并且准备好了
        if (this.playingId === id && this.ready) {
          if (this.isPlaying) {
            // 暂停并准备
            audio.pause()
            this.isPlaying = false
          } else {
            this.playPromise = audio.play()
            this.isPlaying = true
          }
        } else {
          // 如果是不同的曲子或者没准备好，先设置inQueueId和Url
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
              this.afterPlay(url, id, name, artists)
            })
          }
        }
      },
      afterPlay(url, id, name, artists) {
        const audio = this.$refs.audio
        // 如果有inQueueId，接着播放Queue
        if (this.inQueueId) {
          audio.pause()
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
        }
        this.playingUrl = url
        this.playingId = id
        this.playingName = name
        this.playingArtists = artists
      },
      timeUpdate(e) {
        let time = e.target.currentTime * 3.3
        EventBus.$emit("currentTime", time)
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.$refs.audio.volume = this.defaultVolume / 100
      })
      EventBus.$on("playOrder", (order) => {
        order.artists = order.artists.map((v) => {
          return v.name
        })
        this.play(order.url, order.id, order.name, order.artists)
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
