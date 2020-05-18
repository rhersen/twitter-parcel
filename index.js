import { renderToStaticMarkup } from "react-dom/server"
import tweet from "./tweet"

iife().then(() => {
  console.log("done")
})

async function iife() {
  const faunaResp = await fetch(`/.netlify/functions/fauna`)

  if (!faunaResp.ok) {
    document.getElementById(
      "error"
    ).innerHTML = `fauna GET error: ${await faunaResp.text()}`
    return
  }

  const { id_str } = await faunaResp.json()

  await fetchAndShowTweets(id_str, document.getElementById("tweets"))
}

async function mark({ target }) {
  const id_str = target.getAttribute("id_str")
  console.log("mark", id_str)

  const tweets = document.getElementById("tweets")
  tweets.innerHTML = `mark ${id_str}`
  const promise = fetchAndShowTweets(id_str, tweets)

  const faunaResp = await fetch(`/.netlify/functions/fauna`, {
    method: "PUT",
    body: id_str
  })

  if (!faunaResp.ok) {
    document.getElementById(
      "error"
    ).innerHTML = `fauna PUT error: ${await faunaResp.text()}`
    return
  }

  await promise
}

async function fetchAndShowTweets(id_str, tweets) {
  const tweetResp = await fetch(
    `/.netlify/functions/twitter?since_id=${id_str}`
  )

  if (tweetResp.ok) {
    const tweetJson = await tweetResp.json()

    let i = 0
    tweetJson.forEach(t => {
      tweets.insertAdjacentHTML("afterbegin", renderToStaticMarkup(tweet(t)))
      tweets.insertAdjacentHTML(
        "afterbegin",
        `<div class="stats"><span class="countdown">${++i}</span><hr /></div>`
      )
    })
    tweets.querySelectorAll("a.mark").forEach(a => {
      a.addEventListener("click", mark)
    })
  } else
    document.getElementById(
      "error"
    ).innerHTML = `twitter GET error: ${await tweetResp.text()}`
}
