import { renderToStaticMarkup } from "react-dom/server"
import { groupBy, map } from "lodash"
import tweet from "./tweet"

iife().then(() => {
  console.log("done")
})

async function iife() {
  setStatus("fauna GET")
  const faunaResp = await fetch(`/.netlify/functions/fauna`)

  if (!faunaResp.ok) {
    setStatus(`fauna GET error: ${await faunaResp.text()}`)
    return
  }

  const { id_str } = await faunaResp.json()
  setStatus("twitter GET")
  await fetchAndShowTweets(id_str, document.getElementById("tweets"))
}

async function mark({ target }) {
  const id_str = target.getAttribute("id_str")
  console.log("mark", id_str)

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

async function fetchAndShowTweets(id_str, tweets) {
  setStatus("twitter GET")
  const tweetResp = await fetch(
    `/.netlify/functions/twitter?since_id=${id_str}`
  )

  if (tweetResp.ok) {
    setStatus("insertAdjacentHTML")
    const tweetJson = await tweetResp.json()

    let i = 0
    tweetJson.forEach(t => {
      tweets.insertAdjacentHTML("afterbegin", renderToStaticMarkup(tweet(t)))
      tweets.insertAdjacentHTML(
        "afterbegin",
        `<div class="stats"><span class="countdown">${++i}</span><hr /></div>`
      )
    })

    const users = groupBy(tweetJson, "user.screen_name")
    tweets.insertAdjacentHTML(
      "afterbegin",
      `<table>${map(users, (value, key) => {
        if (value.length > 4)
          return `<tr><td>${key}</td><td>${value.length}</td></tr>`
      }).join("")}</table>`
    )

    setStatus("addEventListener")
    tweets.querySelectorAll("a.mark").forEach(a => {
      a.addEventListener("click", mark)
    })
    setStatus("twitter GET OK")
  } else setStatus(`twitter GET error: ${await tweetResp.text()}`)
}

function setStatus(s) {
  document.getElementById("status").innerHTML = s
}
