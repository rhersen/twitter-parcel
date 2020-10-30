@bs.val external document: 'a = "document"

let setStatus = s => {
  document["getElementById"]("status")["innerHTML"] = s
}

let setErrorStatus = s => setStatus("twitter GET error: " ++ s)

let renderTweets = (tweets, . tweet, i: int) => {
  tweets["insertAdjacentHTML"]("afterbegin", Tweet.renderTweet(tweet))
  tweets["insertAdjacentHTML"](
    "afterbegin",
    j`<div class="stats"><span class="countdown" onclick='mark("${tweet.id_str}")'>$i</span><hr /></div>`,
  )
}

let insertUsers = (users, . screenName) => {
  let tweetCount = Js.Dict.unsafeGet(users, screenName)
  tweetCount > 4
    ? j`<tr><td>$screenName</td><td>$tweetCount</td></tr>`
    : ""
}

%%raw(`
import { getUsers } from "./Users.bs.js"

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
  fetch("/.netlify/functions/twitter?since_id=" + id_str).then(handleFetch(tweets))
}
`)
