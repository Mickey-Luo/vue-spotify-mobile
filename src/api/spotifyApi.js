import SpotifyWebApi from "spotify-web-api-js"
import axios from "axios"
const url = "http://124.221.148.61:8000"

// 定义Token方法
const TokenTools = {
  async saveTokens(access_token, refresh_token) {
    localStorage.setItem("vue_spotify_token", access_token)
    localStorage.setItem("vue_spotify_refresh_token", refresh_token)
  },
  refreshToken() {
    axios(url + "/refresh_token", {
      params: {
        refresh_token: localStorage.getItem("vue_spotify_refresh_token")
      }
    })
      .then((res) => {
        localStorage.setItem("vue_spotify_token", res.data.access_token)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  getTokens() {
    return {
      access_token: localStorage.getItem("vue_spotify_token"),
      refresh_token: localStorage.getItem("vue_spotify_refresh_token")
    }
  },
  goAuth() {
    location.href = url
  }
}

// 生成实例
let _spotifyApi = new SpotifyWebApi()
// 加入TokenTools
const spotifyApi = Object.assign(_spotifyApi, TokenTools)

export default spotifyApi
