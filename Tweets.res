%%raw(`
import { getUsers } from "./Users.bs.js"
import { renderTweet } from "./Tweet.bs.js"

let setStatus = s => {
  document.getElementById("status").innerHTML = s
}

let addEventListener = a => {
  a.addEventListener("click", window.mark)
}

let setErrorStatus = s => setStatus("twitter GET error: " + s)

export let fetchAndShowTweets = (id_str, tweets) => {
  let handleJson = tweetJson => {
    let users = getUsers(tweetJson)
    let i = 0

    let renderTweets = tweet => {
      tweets.insertAdjacentHTML("afterbegin", renderTweet(tweet))
      tweets.insertAdjacentHTML(
        "afterbegin",
        '<div class="stats"><span class="countdown" ' +
          "onclick='mark" +
          '("' +
          tweet.id_str +
          '")' +
          "'>" +
          ++i +
          "</span><hr /></div>"
      )
    }

    let insertUsers = key => {
      if (users[key] > 4) {
        return "<tr><td>" + key + "</td><td>" + users[key] + "</td></tr>"
      }
    }

    tweetJson.forEach(renderTweets)

    tweets.insertAdjacentHTML(
      "afterbegin",
      "<table>" +
        Object.keys(users)
          .map(insertUsers)
          .join("") +
        "</table>"
    )

    setStatus("addEventListener")
    tweets.querySelectorAll("a.mark").forEach(addEventListener)
    setStatus("twitter GET OK")
  }

  let handleFetch = tweetResp => {
    if (tweetResp.ok) {
      setStatus("insertAdjacentHTML")

      tweetResp.json().then(handleJson)
    } else {
      tweetResp.text().then(setErrorStatus)
    }
  }

  fetch("/.netlify/functions/twitter?since_id=" + id_str).then(handleFetch)
}
`)
