@bs.val external document: 'a = "document"

let faunaFetch = %raw(`fetch("/.netlify/functions/fauna")`)

Status.set("fauna GET")

faunaFetch->Js.Promise.then_(faunaResp =>
  if faunaResp["ok"] {
    faunaResp["json"]()->Js.Promise.then_(json => {
      Status.set("twitter GET")
      Tweets.fetchAndShowTweets(
        json["id_str"],
        document["getElementById"]("tweets"),
      )->Js.Promise.then_(() => Js.Promise.resolve(Js.log("done")), _)
    }, _)
  } else {
    faunaResp["text"]()->Js.Promise.then_(
      text => Js.Promise.resolve(Status.set("fauna GET error: " ++ text)),
      _,
    )
  }
, _)

%%raw(` import { mark } from "./Mark.bs.js"; window.mark = mark `)
