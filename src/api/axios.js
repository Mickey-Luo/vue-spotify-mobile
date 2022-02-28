import axios from "axios"

const url = "http://localhost:8888"

export function refreshToken() {
  axios(url + "/refresh_token", {
    params: {
      refresh_token: localStorage.getItem("vant_spotify_refresh_token")
    }
  })
    .then((res) => {
      localStorage.setItem("vant_spotify_token", res.data.access_token)
    })
    .catch((err) => {
      console.log(err)
    })
}
