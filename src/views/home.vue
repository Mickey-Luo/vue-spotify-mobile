<template>
  <div id="home">
    <!-- <van-row type="flex" justify="space-between">
      <van-col span="6">晚上好</van-col>
      <van-col span="6"
        ><van-icon name="bullhorn-o" /><van-icon name="clock-o" /><van-icon name="setting-o"
      /></van-col>
    </van-row> -->
    <van-nav-bar class="fixed-nav" left-arrow />

    <van-sticky @scroll="scroll">
      <van-nav-bar
        class=""
        :border="false"
        title="收藏的歌"
        left-arrow
        :style="{ opacity: scrollTop / 250 }"
      />
    </van-sticky>
    <!-- 曲目列表 -->
    <div class="track-list-container">
      <van-list
        ref="list"
        class="track-list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-empty description="占位图：还没做好" />
        <!-- 曲目单元 -->
        <van-cell
          class="track-item"
          v-for="item in list"
          v-lazy="item.track.album.images[1].url"
          :key="item.track.id"
        >
          <van-row class="track-item-flexbox" type="flex">
            <!-- 曲目封面 -->
            <van-col class="track-image">
              <van-image :src="item.track.album.images[1].url" fit="cover" height="68" width="68"
                ><template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </van-col>
            <!-- 曲目信息 -->
            <van-col class="track-detail van-ellipsis">
              <span class="track-name">{{ item.track.name }}</span>
              <div class="artist-name-container van-ellipsis">
                <span class="artist-name" v-for="item in item.track.artists" :key="item.id">
                  {{ item.name }}
                </span>
              </div>
            </van-col>
            <!-- 小图标 -->
            <van-button @click.prevent.stop="1" round icon="ellipsis"></van-button>
          </van-row>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        mySavedTracks: {},
        list: [],
        offset: 0,
        // list组件参数
        loading: false,
        finished: false,
        // 滚动距离
        scrollTop: 0
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
      },
      scroll(e) {
        this.scrollTop = e.scrollTop
      }
    }
  }
</script>

<style lang="less">
  .fixed-nav {
    position: fixed;
    top: 0;
  }
  .van-nav-bar {
    height: 60px;
    .van-nav-bar__content {
      height: 60px;
    }
  }
  .track-list-container {
    padding-bottom: 50px;
  }
  .track-list {
    .track-item {
      padding-top: 6px;
      padding-bottom: 6px;
      height: 80px;
      .track-item-flexbox {
        flex-wrap: nowrap;
        // .track-image {
        //   width: 70px;
        // }
        height: 68px;
        .track-detail {
          padding-left: 14px;
          flex: 1;
          .artist-name-container {
            .artist-name + .artist-name::before {
              content: "·";
            }
          }
        }
        .van-button {
          align-self: center;
          border: none;
          height: 48px;
          width: 48px;
        }
      }
    }
  }
</style>
