iife().then(() => {
  console.log("done")
})

async function iife() {
  const faunaResp = await fetch(`/.netlify/functions/fauna`)
  const tweetResp = await fetch(
    `/.netlify/functions/twitter?since_id=${(await faunaResp.json()).id_str}`
  )

  ;(await tweetResp.json()).forEach(tweet =>
    document
      .getElementById("root")
      .insertAdjacentHTML("beforeend", `<hr /><div>${tweet.full_text}</div>`)
  )
}
