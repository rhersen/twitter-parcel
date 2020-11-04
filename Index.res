@bs.val external document: 'a = "document"

let logDone = () => {
  Js.Promise.resolve(Js.log("done"))
}

let twitterGet = json => {
  Status.set("twitter GET")
  Tweets.fetchAndShowTweets(json["id_str"], document["getElementById"]("tweets"))->Js.Promise.then_(
    logDone,
    _,
  )
}

%%raw(
  `
import { fetchAndShowTweets } from "./Tweets.bs.js"
import { set as setStatus } from "./Status.bs.js"
import { mark } from "./Mark.bs.js"

let faunaGetError = text => {
  setStatus("fauna GET error: " + text)
}

let handleFaunaResponse = faunaResp => {
  if (faunaResp.ok) {
    faunaResp.json().then(twitterGet)
  } else {
    faunaResp.text().then(faunaGetError)
  }
}

setStatus("fauna GET")
fetch("/.netlify/functions/fauna").then(handleFaunaResponse)

window.mark = mark
`
)
