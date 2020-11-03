@bs.val external document: 'a = "document"

let put = %raw(`id_str => fetch("/.netlify/functions/fauna", { method: "PUT", body: id_str })`)

let mark = id_str => {
  Js.log("mark" ++ id_str)
  Status.set("twitter GET")
  let tweets = document["getElementById"]("tweets")
  tweets["innerHTML"] = ""
  Tweets.fetchAndShowTweets(id_str, tweets)->Js.Promise.then_(() => {
    Status.set("fauna PUT")
    put(id_str)->Js.Promise.then_(
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
