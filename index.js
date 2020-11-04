import { fetchAndShowTweets } from "./Tweets.bs.js"
import { set as setStatus } from "./Status.bs.js"
import { mark } from "./Mark.bs.js"

let handleFaunaResponse = faunaResp => {
  if (faunaResp.ok) {
    faunaResp.json().then(twitterGet)
  } else {
    faunaResp.text().then(faunaGetError)
  }
}

let faunaGetError = text => {
  setStatus("fauna GET error: " + text)
}

let twitterGet = ({ id_str }) => {
  setStatus("twitter GET")
  fetchAndShowTweets(id_str, document.getElementById("tweets")).then(
    logDone,
    logFail
  )
}

let logDone = () => {
  console.log("done")
}

let logFail = () => {
  console.log("fail")
}

setStatus("fauna GET")
fetch("/.netlify/functions/fauna").then(handleFaunaResponse)

window.mark = mark
