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

%%raw(
  `
import { set as setStatus } from "./Status.bs.js"
import { fetchAndShowTweets } from "./Tweets.bs.js"

let faunaPut = id_str => () => {
  setStatus("fauna PUT")
  fetch("/.netlify/functions/fauna", {
    method: "PUT",
    body: id_str
  }).then(handleFaunaResponse)
}

export function mark(id_str) {
  console.log("mark", id_str)
  setStatus("twitter GET")
  const tweets = document.getElementById("tweets")
  tweets.innerHTML = ""
  fetchAndShowTweets(id_str, tweets).then(faunaPut(id_str))
}
`
)
