import renderTweet from "./renderTweet"

iife().then(() => {
  console.log("done")
})

async function iife() {
  const faunaResp = await fetch(`/.netlify/functions/fauna`)
  const faunaJson = await faunaResp.json()
  const tweetResp = await fetch(
    `/.netlify/functions/twitter?since_id=${faunaJson.id_str}`
  )
  const tweetJson = await tweetResp.json()

  const tweets = document.getElementById("tweets")
  tweetJson.forEach(tweet =>
    tweets.insertAdjacentHTML("afterbegin", renderTweet(tweet))
  )
}

window.mark = async function mark(id_str) {
  console.log("mark", id_str)
  await fetch(`/.netlify/functions/fauna`, { method: "PUT", body: id_str })

  const tweets = document.getElementById("tweets")
  tweets.innerHTML = ""
  const tweetResp = await fetch(
    `/.netlify/functions/twitter?since_id=${id_str}`
  )
  const tweetJson = await tweetResp.json()
  tweetJson.forEach(tweet =>
    tweets.insertAdjacentHTML("afterbegin", renderTweet(tweet))
  )
}
