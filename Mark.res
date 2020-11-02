let handleText = faunaResp => text => {
  if (!faunaResp["ok"]) {
    Status.set("fauna PUT error: " ++ text)
  } else {
    Status.set("fauna PUT OK")
  }
}

%%raw(`
import { set as setStatus } from "./Status.bs.js"
import { fetchAndShowTweets } from "./Tweets.bs.js"

let handleFaunaResponse = faunaResp => {
  faunaResp.text().then(handleText(faunaResp))
}

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
`)
