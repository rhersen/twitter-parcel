import { getUsers } from "./Users.bs.js"
import { renderTweet } from "./Tweet.bs.js"

export function fetchAndShowTweets(id_str, tweets) {
  fetch(`/.netlify/functions/twitter?since_id=${id_str}`).then(tweetResp => {
    if (tweetResp.ok) {
      setStatus("insertAdjacentHTML")
      tweetResp.json().then(tweetJson => handleResponse(tweetJson, tweets))
    } else {
      tweetResp.text().then(s => setStatus(`twitter GET error: ${s}`))
    }
  })
}

function handleResponse(tweetJson, tweets) {
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
}

function setStatus(s) {
  document.getElementById("status").innerHTML = s
}
