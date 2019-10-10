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
