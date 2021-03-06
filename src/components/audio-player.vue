<template>
  <div>
    <audio ref="audio" src="" preload loop id="audio" @timeupdate="timeUpdate"></audio>
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
        currentRate: 0,
        defaultVolume: 50,
        playPromise: null,
        isPlaying_local: false,
        playingId: "",
        playingName: "Vue-Spotify-Mobile",
        playingUrl: "",
        playingArtists: [],
        playingAlbum: [],
        inQueueId_local: "",
        inQueueUrl: "",
        ready: true,
        playingList: [],
        playingIndex: 0,
        playingListName: "",
      }
    },
    computed: {
      isPlaying: {
        get() {
          return this.isPlaying_local
        },
        set(boolean) {
          this.isPlaying_local = boolean
          this.$nextTick(() => {
            let state = {
              url: this.playingUrl,
              id: this.playingId,
              name: this.playingName,
              artists: this.playingArtists,
              album: this.playingAlbum,
              isPlaying: boolean,
              list: this.playingList,
              index: this.playingIndex,
              listName: this.playingListName,
            }
            // prev
            let prevIndex = this.playingIndex - 1
            if (this.playingIndex === 0) {
              prevIndex = this.playingList.length - 1
            }

            // next
            let nextIndex = this.playingIndex + 1
            if (this.playingIndex === this.playingList.length - 1) {
              nextIndex = 0
            }
            // [artists] => [artist.name]
            const prevArtists = this.playingList[prevIndex].track.artists.map((v) => v.name)
            const nextArtists = this.playingList[nextIndex].track.artists.map((v) => v.name)

            let prevTrack = {
              url: this.playingList[prevIndex].track.preview_url,
              id: this.playingList[prevIndex].track.id,
              name: this.playingList[prevIndex].track.name,
              artists: prevArtists,
              album: this.playingList[prevIndex].track.album,
              index: prevIndex,
            }
            let nextTrack = {
              url: this.playingList[nextIndex].track.preview_url,
              id: this.playingList[nextIndex].track.id,
              name: this.playingList[nextIndex].track.name,
              artists: nextArtists,
              album: this.playingList[nextIndex].track.album,
              index: nextIndex,
            }

            // emit
            EventBus.$emit("playState", state, prevTrack, nextTrack)
          })
        },
      },
      inQueueId: {
        get() {
          return this.inQueueId_local
        },
        set(id) {
          this.inQueueId_local = id
          EventBus.$emit("queue", id)
        },
      },
      volume: {
        get() {
          return this.defaultVolume
        },
        set(val) {
          this.$refs.audio.volume = val / 100
          this.defaultVolume = val
        },
      },
    },

    methods: {
      play(url, id, name, artists, album, list, index, direction, listName) {
        // 如果没有url,跳过
        if (!url) {
          direction === "next" ? this.playingIndex++ : this.playingIndex--
          direction === "next" ? this.next() : this.prev()
          return
        }
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
              // ⭐️播放完成后⭐️
              this.isPlaying = true
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
              // 确定播放数据
              this.playingUrl = url
              this.playingId = id
              this.playingName = name
              this.playingArtists = artists
              this.playingAlbum = album
              this.playingList = list
              this.playingIndex = index
              this.playingListName = listName
            })
          }
        }
      },
      timeUpdate(e) {
        if (this.isPlaying) {
          let rate = e.target.currentTime * 3.3
          EventBus.$emit("currentRate", rate)
          this.$emit("currentRate", rate)
        }
      },
      prev() {
        let to = this.playingIndex - 1
        if (this.playingIndex === 0) {
          to = this.playingList.length - 1
        }
        let track = this.playingList[to].track
        let artists = track.artists.map((v) => {
          return v.name
        })
        this.play(track.preview_url, track.id, track.name, artists, track.album, this.playingList, to, "prev", this.playingListName)
      },
      next() {
        let to = this.playingIndex + 1
        if (this.playingIndex === this.playingList.length - 1) {
          to = 0
        }
        let track = this.playingList[to].track
        let artists = track.artists.map((v) => {
          return v.name
        })
        this.play(track.preview_url, track.id, track.name, artists, track.album, this.playingList, to, "next", this.playingListName)
      },
    },
    mounted() {
      this.$nextTick(function () {
        this.$refs.audio.volume = this.defaultVolume / 100
      })
      EventBus.$on("playOrder", (order) => {
        order.artists = order.artists.map((v) => {
          return v.name
        })
        this.play(order.url, order.id, order.name, order.artists, order.album, order.list, order.index, "", order.listName)
      })
    },
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
