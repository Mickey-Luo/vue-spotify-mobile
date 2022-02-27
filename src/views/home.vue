<template>
  <div id="home">
    <van-row type="flex" justify="space-between">
      <van-col span="6">晚上好</van-col>
      <van-col span="6"
        ><van-icon name="bullhorn-o" /><van-icon name="clock-o" /><van-icon name="setting-o"
      /></van-col>
    </van-row>
  <!-- 曲目列表 -->
    <van-list
      class="track-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
    <!-- 曲目单元 -->
      <van-cell class="track-item" v-for="(item, index) in list" v-lazy="item" :key="index">
        <van-row type="flex" justify="space-between">
          <van-col span="6">
            <van-image :src="item.track.album.images[1].url" fit="cover" />
          </van-col>
          <van-col class="track-detail van-ellipsis" span="17">
            <span class="track-name">{{ item.track.name }}</span>
            <div class="artist-name-container">
              <span class="artist-name" v-for="item in item.track.artists" :key="item.id">
                {{ item.name }}
              </span>
            </div>
          </van-col>
        </van-row>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
  export default {
    created() {},
    data() {
      return {
        mySavedTracks: {},
        list: [],
        offset: 0,
        loading: false,
        finished: false
      }
    },
    methods: {
      onLoad() {
        // 异步更新数据
        console.log("异步更新数据")
        this.$spotifyApi.getMySavedTracks({ offset: this.offset, limit: 20 }, (err, data) => {
          if (err) console.error(err)
          else {
            console.log(data.items)

            // 添加数据到数组
            this.list.push(...data.items)

            // 加载状态结束
            this.loading = false

            // 数据全部加载完成
            if (data.length < 2) {
              this.finished = true
            }
          }
        })
        // 请求完后
        this.offset += 20
      }
    }
  }
</script>

<style lang="less">
  .track-list {
    .track-item {
      height: 110px;
      .track-detail {
        // margin-left: 8px;
        .artist-name-container {
          .artist-name + .artist-name::before {
            content: "·";
          }
        }
      }
    }
  }
</style>
