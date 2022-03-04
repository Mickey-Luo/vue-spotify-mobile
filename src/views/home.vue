<template>
  <div id="home">
    <keep-alive>
      <transition :name="navForward ? 'go' : 'backward'">
        <component class="component" id="component" :is="navHistory[navHistory.length - 1] || navBase" @go="go" @backward="backward" :playlistId="playlistId">
        </component>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
  // import EventBus from "../utils/EventBus"
  import tracklist from "../components/tracklist.vue"
  import savedPage from "../views/saved-page.vue"
  import homePage from "./home-page.vue"
  export default {
    name: "home",
    components: {
      tracklist: tracklist,
      "saved-page": savedPage,
      "home-page": homePage,
    },
    data() {
      return {
        navBase: "home-page",
        navHistory: ["home-page"],
        navForward: true,
        playlistId: "",
      }
    },
    methods: {
      go(dest, playlistId) {
        this.navForward = true
        console.log(playlistId)
        this.playlistId = playlistId
        this.navHistory.push(dest)
      },
      backward() {
        this.navForward = false
        this.navHistory.pop()
      },
    },
  }
</script>

<style lang="less" scoped>
  #home {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .component {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      position: absolute;
      padding-bottom: 120px;
      box-sizing: border-box;
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      &::-webkit-scrollbar {
        display: none;
      }
    }
    // 前进
    .go-enter-active,
    .go-leave-active {
      transition: transform 0.5s;
    }
    .go-enter {
      transform: translateX(100%);
    }
    .go-leave-to {
      transform: translateX(-100%);
    }
    // 后退
    .backward-enter-active,
    .backward-leave-active {
      transition: transform 0.5s;
    }
    .backward-enter {
      transform: translateX(-100%);
    }
    .backward-leave-to {
      transform: translateX(100%);
    }
  }
</style>
