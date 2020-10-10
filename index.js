import { fetchAndShowTweets } from "./fetchAndShowTweets.js"

iife().then(
  () => {
    console.log("done")
  },
  () => {
    console.log("fail")
  }
)

async function iife() {
  setStatus("fauna GET")
  const faunaResp = await fetch(`/.netlify/functions/fauna`)

  if (!faunaResp.ok) {
    setStatus(`fauna GET error: ${await faunaResp.text()}`)
    return
  }

  const { id_str } = await faunaResp.json()
  setStatus("Welcome!")
  await fetchAndShowTweets(id_str, document.getElementById("tweets"))
}

window.mark = async function mark(id_str) {
  console.log("mark", id_str)

  setStatus("twitter GET")
  const tweets = document.getElementById("tweets")
  tweets.innerHTML = ""
  await fetchAndShowTweets(id_str, tweets)

  setStatus("fauna PUT")
  const faunaResp = await fetch(`/.netlify/functions/fauna`, {
    method: "PUT",
    body: id_str
  })

  if (!faunaResp.ok) setStatus(`fauna PUT error: ${await faunaResp.text()}`)
  else setStatus("fauna PUT OK")
}

function setStatus(s) {
  document.getElementById("status").innerHTML = s
}
