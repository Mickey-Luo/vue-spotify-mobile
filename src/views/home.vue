<template>
  <div id="home">
    <van-row type="flex" justify="space-between">
      <van-col span="6">晚上好</van-col>
      <van-col span="6"><van-icon name="bullhorn-o" /><van-icon name="clock-o" /><van-icon name="setting-o" /></van-col>
    </van-row>
    <van-grid clickable direction="horizontal" :gutter="10" :column-num="2">
      <van-grid-item v-for="value in 6" :key="value" icon="photo-o" text="文字" />
    </van-grid>
    <div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
#home /deep/ .slider {
  width: 1000px;
}
</style>
