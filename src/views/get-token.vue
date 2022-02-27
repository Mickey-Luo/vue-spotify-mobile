<template>
  <div>加载中...</div>
</template>

<script>
import spotifyApi from "@/api/index"
export default {
  created() {
    spotifyApi.setAccessToken(this.$route.params)
    this.$router.push("/home")
  }
}
</script>

<style lang="less"></style>
