<template>
  <div id="player-controls">
    <div class="container">
      <div class="track-detail">
        <p class="name van-ellipsis">{{ state.name }}</p>
        <p class="artists van-ellipsis">{{ state.artists.join("·") }}</p>
      </div>
      <div class="play-button">
        <van-icon v-if="!state.isPlaying" @click.stop="play" name="play" size="28px" />
        <van-icon v-if="state.isPlaying" @click.stop="pause" name="pause" size="28x" />
      </div>
    </div>
    <audio-player ref="player" @playState="playState"></audio-player>
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
        state: {
          url: "",
          id: "",
          name: "欢迎使用Vant-Spotify",
          artists: ["by Mickey-Luo@Github"],
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

    .container {
      box-sizing: border-box;
      margin: 0 auto;
      padding: 4px 8px;
      height: 100%;
      max-width: 92%;
      border-radius: 6px;
      background-color: #f2f2f2f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
      & * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .track-detail {
        flex: 1;
        max-width: 84%;
        max-height: 100%;
        .name {
          font-size: 16px;
        }
        .artists {
          font-size: 12px;
        }
      }
      .play-button {
        width: 32px;
      }
    }
  }
</style>
