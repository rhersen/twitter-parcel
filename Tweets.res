let fetchAndShowTweets = (id_str, tweets) => {
  let since = %raw(`s => fetch("/.netlify/functions/twitter?since_id=" + s)`)

  let handleJson = (tweetJson: array<Tweet.status>) => {
    let users = Users.getUsers(tweetJson)

    let renderTweets = (tweet, i) => {
      tweets["insertAdjacentHTML"]("afterbegin", Tweet.renderTweet(tweet))
      tweets["insertAdjacentHTML"](
        "afterbegin",
        j`<div class="stats"><span class="countdown" onclick='mark("${tweet.id_str}")'>$i</span><hr /></div>`,
      )
    }

    let insertUsers = (users, screenName) => {
      let tweetCount = Js.Dict.unsafeGet(users, screenName)
      tweetCount > 4 ? j`<tr><td>$screenName</td><td>$tweetCount</td></tr>` : ""
    }

    Js.Array.forEachi(renderTweets, tweetJson)

    tweets["insertAdjacentHTML"](
      "afterbegin",
      "<table>" ++
      Js.Array.joinWith("", Js.Array.map(insertUsers(users), Js.Dict.keys(users))) ++ "</table>",
    )

    Status.set("twitter GET OK")
  }

  let handleFetch = tweetResp => {
    if tweetResp["ok"] {
      Status.set("insertAdjacentHTML")

      tweetResp["json"]()->Js.Promise.then_(
        tweetJson => Js.Promise.resolve(handleJson(tweetJson)),
        _,
      )
    } else {
      tweetResp["text"]()->Js.Promise.then_(
        s => Js.Promise.resolve(Status.set("twitter GET error: " ++ s)),
        _,
      )
    }
  }

  since(id_str)->Js.Promise.then_(tweetResp => Js.Promise.resolve(handleFetch(tweetResp)), _)
}
