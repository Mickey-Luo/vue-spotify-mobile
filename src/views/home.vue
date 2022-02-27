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
      <van-nav-bar class="" :border="false" left-arrow :style="{ opacity: scrollTop / 250 }">
        <template #title>
          <p
            :style="{
              opacity: (scrollTop - 150) / 50,
              transform: 'translateY(' + 80 / (scrollTop - 150) + 'px)'
            }"
          >
            已收藏的歌曲
          </p>
        </template></van-nav-bar
      >
    </van-sticky>
    <!-- 曲目列表 -->
    <van-search
      v-model="searchValue"
      show-action
      shape="round"
      placeholder="请输入搜索关键词"
      :style="{ opacity: 1 - (scrollTop - 5) / 25 }"
    >
      <template #action>
        <!-- <div @click="onSearch">搜索</div> -->
        <div>排序</div>
      </template>
    </van-search>
    <h2 class="page-title" :style="{ opacity: 1.1 - (scrollTop - 50) / 80 }">已收藏的歌曲</h2>
    <van-empty
      description="占位图：还没做好"
      :style="{ opacity: 1 - scrollTop / 250 }"
      image-size="50px"
    />
    <div class="track-list-container">
      <van-list
        ref="list"
        class="track-list"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
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
            <van-button @click="show = true" round icon="ellipsis"></van-button>
          </van-row>
        </van-cell>
        <van-action-sheet
          v-model="show"
          :actions="actions"
          cancel-text="取消"
          description="这是一段描述信息"
          close-on-click-action
        />
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
        scrollTop: 0,
        show: false,
        actions: [{ name: "选项一" }, { name: "选项二" }, { name: "选项三" }],
        searchValue: ""
      }
    },
    methods: {
      onLoad() {
        // 异步更新数据
        console.log("异步更新数据")
        this.$spotifyApi.getMySavedTracks({ offset: this.offset, limit: 20 }, (err, data) => {
          if (err) {
            console.error(err)
            // 如果token过期
            if (err.status === 401) alert("token过期")
            this.$spotifyApi.refreshToken()
            // this.$forceUpdate()
          } else {
            // console.log(data.items)

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
        console.log(parseInt(150 / (150 - e.scrollTop)))
        this.scrollTop = e.scrollTop
      }
    }
  }
</script>

<style lang="less">
  h2.page-title {
    // display: block;
    box-sizing: border-box;
    padding: 0 14px;
  }
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
          .track-name {
            font-weight: 500;
          }
          .artist-name-container {
            opacity: 0.6;
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
