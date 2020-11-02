import { fetchAndShowTweets } from "./Tweets.bs.js"
import { set as setStatus } from "./Status.bs.js"
import { mark } from "./mark.js"

setStatus("fauna GET")
fetch(`/.netlify/functions/fauna`).then(faunaResp => {
  if (!faunaResp.ok) {
    faunaResp.text().then(text => {
      setStatus(`fauna GET error: ${text}`)
    })
  } else
    faunaResp.json().then(({ id_str }) => {
      setStatus("twitter GET")
      fetchAndShowTweets(id_str, document.getElementById("tweets")).then(
        () => {
          console.log("done")
        },
        () => {
          console.log("fail")
        }
      )
    })
})

window.mark = mark
