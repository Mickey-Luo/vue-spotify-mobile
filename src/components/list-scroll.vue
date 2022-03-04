<template>
  <div>
    <h3>{{ playlists.name }}</h3>
    <div class="grid-container">
      <div class="grid">
        <div class="grid-item" v-for="(item, index) in playlists.items" :key="index" @click="go('tracklist', item.id)">
          <van-image :src="item.images[0].url" />
          <p v-html="item.description" class="van-multi-ellipsis--l2"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "list-scroll",
    data() {
      return {}
    },
    props: {
      playlists: {
        type: Object,
        required: true,
      },
    },
    methods: {
      go(dest, playlistId) {
        this.$emit("go", dest, playlistId)
      },
      backward() {
        this.$emit("backward")
      },
    },
  }
</script>

<style lang="less" scoped>
  h3 {
    margin: 0 0 8px 15px;
  }
  .grid-container {
    width: 100%;
    height: 190px;
    overflow: hidden;
    .grid {
      height: 100%;
      overflow: auto;
      display: flex;
      justify-content: start;
      gap: 15px;
      padding: 0 15px;
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      &::-webkit-scrollbar {
        display: none;
      }
      .grid-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 14px;
        font-weight: 300;

        .van-image {
          width: 130px;
          height: 130px;
        }
      }
    }
  }
</style>
