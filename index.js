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

  const faunaJson = await faunaResp.json()
  const tweetResp = await fetch(
    `/.netlify/functions/twitter?since_id=${faunaJson.id_str}`
  )

  if (!tweetResp.ok) {
    document.getElementById("error").innerHTML = await tweetResp.text()
    return
  }

  const tweetJson = await tweetResp.json()

  const stats = document.getElementById("stats")
  stats.insertAdjacentHTML("afterbegin", `${tweetJson.length} tweets`)

  const tweets = document.getElementById("tweets")
  tweetJson.forEach(tweet =>
    tweets.insertAdjacentHTML("afterbegin", renderTweet(tweet))
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

  const tweets = document.getElementById("tweets")
  tweets.innerHTML = ""
  const tweetResp = await fetch(
    `/.netlify/functions/twitter?since_id=${id_str}`
  )
  const tweetJson = await tweetResp.json()

  if (!tweetResp.ok) {
    document.getElementById("error").innerHTML = await tweetResp.text()
    return
  }

  const stats = document.getElementById("stats")
  stats.innerHTML = ""
  stats.insertAdjacentHTML("afterbegin", `${tweetJson.length} tweets`)

  tweetJson.forEach(tweet =>
    tweets.insertAdjacentHTML("afterbegin", renderTweet(tweet))
  )
}
