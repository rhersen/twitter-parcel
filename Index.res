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

let faunaGetError = text => {
  Js.Promise.resolve(Status.set("fauna GET error: " ++ text))
}

let handleFaunaResponse = faunaResp => {
  if (faunaResp["ok"]) {
    faunaResp["json"]()->Js.Promise.then_(twitterGet,_)
  } else {
    faunaResp["text"]()->Js.Promise.then_(faunaGetError,_)
  }
}

%%raw(
  `
import { set as setStatus } from "./Status.bs.js"
import { mark } from "./Mark.bs.js"

setStatus("fauna GET")
fetch("/.netlify/functions/fauna").then(handleFaunaResponse)

window.mark = mark
`
)
