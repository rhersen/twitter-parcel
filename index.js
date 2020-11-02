import { fetchAndShowTweets } from "./Tweets.bs.js"
import { set as setStatus } from "./Status.bs.js"

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

function mark(id_str) {
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
        if (!faunaResp.ok) setStatus(`fauna PUT error: ${text}`)
        else setStatus("fauna PUT OK")
      })
    })
  })
}

window.mark = mark
