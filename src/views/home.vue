<template>
  <div id="home">
    <van-row type="flex" justify="space-between">
      <van-col span="6">晚上好</van-col>
      <van-col span="6"><van-icon name="bullhorn-o" /><van-icon name="clock-o" /><van-icon name="setting-o" /></van-col>
    </van-row>

    <div class="track-list" clickable :gutter="10" :column-num="1">
      <van-row class="track-item" v-for="item in mySavedTracks.items" :key="item.track.id" type="flex">
        <van-col span="6"><van-image :src="item.track.album.images[1].url" height="100px" fit="cover" /></van-col>
        <van-col class="track-name" span="18">{{ item.track.name }}</van-col>
      </van-row>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  created() {
    this.$spotifyApi.getMySavedTracks({}, (err, data) => {
      if (err) console.error(err)
      else {
        console.log("MySavedTracks", data)
        this.mySavedTracks = data
      }
    })
  },
  data() {
    return {
      mySavedTracks: {}
    }
  }
}
</script>

<style lang="less">
.track-list {
  .track-item {
    height: 100px;
  }
}
</style>
