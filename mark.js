import { set as setStatus } from "./Status.bs.js"
import { fetchAndShowTweets } from "./Tweets.bs.js"

export function mark(id_str) {
  console.log("mark", id_str)

  setStatus("twitter GET")
  const tweets = document.getElementById("tweets")
  tweets.innerHTML = ""
  fetchAndShowTweets(id_str, tweets).then(() => {
    setStatus("fauna PUT")
    fetch(`/.netlify/functions/fauna`, {
      method: "PUT",
      body: id_str
    }).then(faunaResp => {
      faunaResp.text().then(text => {
        if (!faunaResp.ok) {
          setStatus(`fauna PUT error: ${text}`)
        } else {
          setStatus("fauna PUT OK")
        }
      })
    })
  })
}
