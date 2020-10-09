import getUsers from "./users"
import renderTweet from "./renderTweet"

export async function fetchAndShowTweets(id_str, tweets) {
  const tweetResp = await fetch(
    `/.netlify/functions/twitter?since_id=${id_str}`
  )

  if (tweetResp.ok) {
    setStatus("insertAdjacentHTML")
    const tweetJson = await tweetResp.json()
    const users = getUsers(tweetJson)

    let i = 0
    tweetJson.forEach(tweet => {
      tweets.insertAdjacentHTML("afterbegin", renderTweet(tweet))
      tweets.insertAdjacentHTML(
        "afterbegin",
        `<div class="stats"><span class="countdown" onclick='mark("${
          tweet.id_str
        }")'>${++i}</span><hr /></div>`
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
      a.addEventListener("click", window.mark)
    })
    setStatus("twitter GET OK")
  } else setStatus(`twitter GET error: ${await tweetResp.text()}`)

  function setStatus(s) {
    document.getElementById("status").innerHTML = s
  }
}
