import renderTweet from "./renderTweet"

iife().then(() => {
  console.log("done")
})

async function iife() {
  const faunaResp = await fetch(`/.netlify/functions/fauna`)
  const tweetResp = await fetch(
    `/.netlify/functions/twitter?since_id=${(await faunaResp.json()).id_str}`
  )

  const tweets = document.getElementById("tweets")
  ;(await tweetResp.json()).forEach(tweet =>
    tweets.insertAdjacentHTML("afterbegin", renderTweet(tweet))
  )
}
