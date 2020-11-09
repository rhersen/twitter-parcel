@bs.val external document: 'a = "document"
@bs.val external fetch: string => Js.Promise.t<'a> = "fetch"

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
, fetch("/.netlify/functions/fauna"))
