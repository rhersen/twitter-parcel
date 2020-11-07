@bs.val external document: 'a = "document"

let faunaGet = %raw(`fetch("/.netlify/functions/fauna")`)
let faunaPut = %raw(`id_str => fetch("/.netlify/functions/fauna", { method: "PUT", body: id_str })`)

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

let mark = id_str => {
  Js.log("mark" ++ id_str)
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
  }, Tweets.fetchAndShowTweets(id_str, tweets))
}

%%raw(`window.mark = mark`)
