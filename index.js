(async function () {
  const faunaResp = await fetch(`/.netlify/functions/fauna`)
  const faunaJson = await faunaResp.json()
  const tweetResp = await fetch(`/.netlify/functions/twitter?since_id=${faunaJson.id_str}`)
  const tweetJson = await tweetResp.json()
  tweetJson.forEach(tweet => document.getElementById('root').insertAdjacentHTML('beforeend', `<div>${tweet.full_text}</div>`))
})()
