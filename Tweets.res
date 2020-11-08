@bs.val external document: 'a = "document"

let faunaPut = %raw(`id_str => fetch("/.netlify/functions/fauna", { method: "PUT", body: id_str })`)

let fetchAndShowTweets = (id_str, tweets) => {
  let since = %raw(`s => fetch("/.netlify/functions/twitter?since_id=" + s)`)

  let handleJson = (tweetJson: array<Tweet.status>) => {
    let users = Users.getUsers(tweetJson)

    let renderTweets = (tweet, i) => {
      tweets["insertAdjacentHTML"]("afterbegin", Tweet.renderTweet(tweet))
      tweets["insertAdjacentHTML"](
        "afterbegin",
        j`<div class="stats"><span class="countdown" id=${tweet.id_str}>$i</span><hr /></div>`,
      )
    }

    let insertUsers = (users, screenName) => {
      let tweetCount = Js.Dict.unsafeGet(users, screenName)
      tweetCount > 4 ? j`<tr><td>$screenName</td><td>$tweetCount</td></tr>` : ""
    }

    Js.Array.forEachi(renderTweets, tweetJson)
    Js.Array.forEach(%raw(`el => el.onclick = mark`), tweets["querySelectorAll"](".countdown"))

    tweets["insertAdjacentHTML"](
      "afterbegin",
      "<table>" ++
      Js.Array.joinWith("", Js.Array.map(insertUsers(users), Js.Dict.keys(users))) ++ "</table>",
    )

    Js.Promise.resolve(Status.set("twitter GET OK"))
  }

  let handleFetch = tweetResp => {
    if tweetResp["ok"] {
      Status.set("insertAdjacentHTML")

      Js.Promise.then_(handleJson, tweetResp["json"]())
    } else {
      Js.Promise.then_(
        s => Js.Promise.resolve(Status.set("twitter GET error: " ++ s)),
        tweetResp["text"](),
      )
    }
  }

  Js.Promise.then_(handleFetch, since(id_str))
}

let mark = event => {
  let id_str = event["target"]["getAttribute"]("id")
  Status.set("twitter GET")
  let tweets = document["getElementById"]("tweets")
  tweets["innerHTML"] = ""
  Js.Promise.then_(() => {
    Status.set("fauna PUT")
    Js.Promise.then_(
      faunaResp =>
        Js.Promise.then_(
          text =>
            Js.Promise.resolve(
              Status.set(faunaResp["ok"] ? "fauna PUT OK" : "fauna PUT error: " ++ text),
            ),
          faunaResp["text"](),
        ),
      faunaPut(id_str),
    )
  }, fetchAndShowTweets(id_str, tweets))
}
