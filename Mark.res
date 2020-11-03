@bs.val external document: 'a = "document"

let handleText = (faunaResp, text) => {
  if !faunaResp["ok"] {
    Js.Promise.resolve(Status.set("fauna PUT error: " ++ text))
  } else {
    Js.Promise.resolve(Status.set("fauna PUT OK"))
  }
}

let handleFaunaResponse = faunaResp => {
  faunaResp["text"]()->Js.Promise.then_(handleText(faunaResp), _)
}

let put = %raw(`id_str => fetch("/.netlify/functions/fauna", { method: "PUT", body: id_str })`)

let faunaPut = (id_str, ()) => {
  Status.set("fauna PUT")
  put(id_str)->Js.Promise.then_(handleFaunaResponse, _)
}

let mark = id_str => {
  Js.log("mark" ++ id_str)
  Status.set("twitter GET")
  let tweets = document["getElementById"]("tweets")
  tweets["innerHTML"] = ""
  Tweets.fetchAndShowTweets(id_str, tweets)->Js.Promise.then_(faunaPut(id_str), _)
}
