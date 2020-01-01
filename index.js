import renderTweet from "./renderTweet"

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

  await fetchAndShowTweets(
    id_str,
    document.getElementById("stats"),
    document.getElementById("tweets")
  )
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

  const stats = document.getElementById("stats")
  const tweets = document.getElementById("tweets")
  stats.innerHTML = ""
  tweets.innerHTML = ""
  await fetchAndShowTweets(id_str, stats, tweets)
}

async function fetchAndShowTweets(id_str, stats, tweets) {
  const tweetResp = await fetch(
    `/.netlify/functions/twitter?since_id=${id_str}`
  )

  if (tweetResp.ok) {
    const tweetJson = await tweetResp.json()

    stats.insertAdjacentHTML("afterbegin", `${tweetJson.length} tweets`)

    tweetJson.forEach(tweet =>
      tweets.insertAdjacentHTML("afterbegin", renderTweet(tweet))
    )
  } else document.getElementById("error").innerHTML = await tweetResp.text()
}
