import { renderToStaticMarkup } from "react-dom/server"
import tweet from "./tweet"

iife().then(() => {
  console.log("done")
})

async function iife() {
  const faunaResp = await fetch(`/.netlify/functions/fauna`)

  if (!faunaResp.ok) {
    document.getElementById("error").innerHTML = await faunaResp.text()
    return
  }

  const { id_str } = await faunaResp.json()

  await fetchAndShowTweets(id_str, document.getElementById("tweets"))
}

window.mark = async function mark(id_str) {
  console.log("mark", id_str)
  const faunaResp = await fetch(`/.netlify/functions/fauna`, {
    method: "PUT",
    body: id_str
  })

  if (!faunaResp.ok) {
    document.getElementById("error").innerHTML = await faunaResp.text()
    return
  }

  const tweets = document.getElementById("tweets")
  tweets.innerHTML = ""
  await fetchAndShowTweets(id_str, tweets)
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
      const id_str = a.getAttribute("id_str")
      a.addEventListener("click", () => window.mark(id_str))
    })
  } else document.getElementById("error").innerHTML = await tweetResp.text()
}
