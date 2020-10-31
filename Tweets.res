@bs.val external document: 'a = "document"

let setStatus = s => {
  document["getElementById"]("status")["innerHTML"] = s
}

let setErrorStatus = s => setStatus("twitter GET error: " ++ s)

let renderTweets = (tweets, tweet, i) => {
  tweets["insertAdjacentHTML"]("afterbegin", Tweet.renderTweet(tweet))
  tweets["insertAdjacentHTML"](
    "afterbegin",
    j`<div class="stats"><span class="countdown" onclick='mark("${tweet.id_str}")'>$i</span><hr /></div>`,
  )
}

let insertUsers = (users, screenName) => {
  let tweetCount = Js.Dict.unsafeGet(users, screenName)
  tweetCount > 3 ? j`<tr><td>$screenName</td><td>$tweetCount</td></tr>` : ""
}

let handleJson = (tweets, tweetJson: array<Tweet.status>) => {
  let users = Users.getUsers(tweetJson)

  Js.Array.forEachi(renderTweets(tweets), tweetJson)

  tweets["insertAdjacentHTML"](
    "afterbegin",
    "<table>" ++
    Js.Array.joinWith("", Js.Array.map(insertUsers(users), Js.Dict.keys(users))) ++ "</table>",
  )

  setStatus("twitter GET OK")
}

let handleFetch = (tweets, . tweetResp) => {
  if tweetResp["ok"] {
    setStatus("insertAdjacentHTML")

    tweetResp["json"]()->Js.Promise.then_(
      tweetJson => Js.Promise.resolve(handleJson(tweets, tweetJson)),
      _,
    )
  } else {
    tweetResp["text"]()->Js.Promise.then_(s => Js.Promise.resolve(setErrorStatus(s)), _)
  }
}

%%raw(
  `

export let fetchAndShowTweets = (id_str, tweets) => {
  fetch("/.netlify/functions/twitter?since_id=" + id_str).then(handleFetch(tweets))
}
`
)
