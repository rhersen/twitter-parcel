import renderTweet from "./renderTweet"

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

window.mark = async function mark(id_str) {
  console.log("mark", id_str)

  setStatus("twitter GET")
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
  const tweetResp = await fetch(
    `/.netlify/functions/twitter?since_id=${id_str}`
  )

  if (tweetResp.ok) {
    setStatus("insertAdjacentHTML")
    const tweetJson = await tweetResp.json()

    const users = {}
    let i = 0
    tweetJson.forEach(tweet => {
      const screenName = tweet.user.screen_name
      const found = users[screenName]
      if (found) users[screenName] = users[screenName] + 1
      else users[screenName] = 1
      tweets.insertAdjacentHTML("afterbegin", renderTweet(tweet))
      tweets.insertAdjacentHTML(
        "afterbegin",
        `<div class="stats"><span class="countdown">${++i}</span><hr /></div>`
      )
    })

    tweets.insertAdjacentHTML(
      "afterbegin",
      `<table>${Object.keys(users)
        .map(key => {
          if (users[key] > 4)
            return `<tr><td>${key}</td><td>${users[key]}</td></tr>`
        })
        .join("")}</table>`
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
