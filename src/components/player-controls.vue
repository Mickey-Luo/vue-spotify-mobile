<template>
  <div id="player-controls">
    <div class="track">
      <div class="track-cover">
        <img
          :src="Object.keys(state.album).length !== 0 ? state.album.images[1].url : ''"
          v-show="Object.keys(state.album).length !== 0"
        />
      </div>
      <div class="track-detail">
        <p class="name van-ellipsis">{{ state.name }}</p>
        <p class="artists van-ellipsis">{{ state.artists.join("·") }}</p>
      </div>
      <div class="play-button">
        <van-icon v-if="!state.isPlaying" @click.stop="play" name="play" size="28px" />
        <van-icon v-if="state.isPlaying" @click.stop="pause" name="pause" size="28x" />
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
  export default {
    name: "player-controls",
    components: {
      "audio-player": AudioPlayer
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
          isPlaying: false
        }
      }
    },
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
      }
    }
  }
</script>

<style lang="less" scoped>
  #player-controls {
    width: 100%;
    height: 54px;
    position: fixed;
    bottom: 65px;
    .track {
      position: relative;
      box-sizing: border-box;
      overflow: hidden;
      margin: 0 auto;
      padding: 4px 8px;
      max-width: 92%;
      height: 100%;
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
