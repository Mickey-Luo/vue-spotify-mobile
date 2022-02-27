<template>
  <div>2</div>
</template>

<script>
import spotifyApi from "../api/index"

export default {
  created() {
    spotifyApi.getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE", function (err, data) {
      if (err) console.error(err)
      else console.log("Artist albums", data)
    })
  }
}
</script>

<style></style>
