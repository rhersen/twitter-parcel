@bs.val external document: 'a = "document"

let faunaGet = %raw(`fetch("/.netlify/functions/fauna")`)
let faunaPut = %raw(`id_str => fetch("/.netlify/functions/fauna", { method: "PUT", body: id_str })`)

Status.set("fauna GET")

faunaGet->Js.Promise.then_(faunaResp =>
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

let mark = id_str => {
  Js.log("mark" ++ id_str)
  Status.set("twitter GET")
  let tweets = document["getElementById"]("tweets")
  tweets["innerHTML"] = ""
  Tweets.fetchAndShowTweets(id_str, tweets)->Js.Promise.then_(() => {
    Status.set("fauna PUT")
    faunaPut(id_str)->Js.Promise.then_(
      faunaResp =>
        faunaResp["text"]()->Js.Promise.then_(
          text =>
            Js.Promise.resolve(
              Status.set(faunaResp["ok"] ? "fauna PUT OK" : "fauna PUT error: " ++ text),
            ),
          _,
        ),
      _,
    )
  }, _)
}

%%raw(`window.mark = mark`)
