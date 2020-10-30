import { getUsers } from "./Users.bs.js"
import { renderTweet } from "./Tweet.bs.js"

let setStatus = s => {
  document.getElementById("status").innerHTML = s
}

let setErrorStatus = s => setStatus("twitter GET error: " + s)

let renderTweets = tweets => (tweet, i) => {
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

let insertUsers = users => key =>
  users[key] > 4
    ? "<tr><td>" + key + "</td><td>" + users[key] + "</td></tr>"
    : ""

let handleJson = tweets => tweetJson => {
  let users = getUsers(tweetJson)

  tweetJson.forEach(renderTweets(tweets))

  tweets.insertAdjacentHTML(
    "afterbegin",
    "<table>" +
      Object.keys(users)
        .map(insertUsers(users))
        .join("") +
      "</table>"
  )

  setStatus("twitter GET OK")
}

let handleFetch = tweets => tweetResp => {
  if (tweetResp.ok) {
    setStatus("insertAdjacentHTML")

    tweetResp.json().then(handleJson(tweets))
  } else {
    tweetResp.text().then(setErrorStatus)
  }
}

export let fetchAndShowTweets = (id_str, tweets) => {
  fetch("/.netlify/functions/twitter?since_id=" + id_str).then(
    handleFetch(tweets)
  )
}
