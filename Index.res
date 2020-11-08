@bs.val external document: 'a = "document"

let faunaGet = %raw(`fetch("/.netlify/functions/fauna")`)

Status.set("fauna GET")

Js.Promise.then_(faunaResp =>
  if faunaResp["ok"] {
    Js.Promise.then_(json => {
      Status.set("twitter GET")
      Js.Promise.then_(
        () => Js.Promise.resolve(Js.log("done")),
        Tweets.fetchAndShowTweets(json["id_str"], document["getElementById"]("tweets")),
      )
    }, faunaResp["json"]())
  } else {
    Js.Promise.then_(
      text => Js.Promise.resolve(Status.set("fauna GET error: " ++ text)),
      faunaResp["text"](),
    )
  }
, faunaGet)
