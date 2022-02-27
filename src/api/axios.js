import axios from "axios"

const url = "http://localhost:8888"

export function refreshToken() {
  axios(url + "/refresh_token", {
    params: {
      refresh_token: localStorage.getItem("vant_spotify_refresh_token")
    }
  })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}
