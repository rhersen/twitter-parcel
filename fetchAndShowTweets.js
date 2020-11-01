import { getUsers } from "./Users.bs.js"
import { renderTweet } from "./Tweet.bs.js"

function setStatus(s) {
  document.getElementById("status").innerHTML = s
}

function addEventListener(a) {
  a.addEventListener("click", window.mark)
}

function setErrorStatus(s) {
  return setStatus("twitter GET error: " + s)
}

export function fetchAndShowTweets(id_str, tweets) {
  var handleJson = function (tweetJson) {
    let users = getUsers(tweetJson)
    let i = 0

    var renderTweets = function (tweet) {
      tweets.insertAdjacentHTML("afterbegin", renderTweet(tweet))
      tweets.insertAdjacentHTML(
        "afterbegin",
        "<div class=\"stats\"><span class=\"countdown\" " +
        "onclick='mark" +
        "(\"" +
        tweet.id_str +
        "\")" +
        "'>" +
        ++i +
        "</span><hr /></div>"
      )
    }

    var insertUsers = function (key) {
      if (users[key] > 4) {
        return "<tr><td>" + key + "</td><td>" + users[key] + "</td></tr>"
      }
    }

    tweetJson.forEach(renderTweets)

    tweets.insertAdjacentHTML(
      "afterbegin",
      "<table>" +
      Object.keys(users)
        .map(insertUsers)
        .join("") +
      "</table>"
    )

    setStatus("addEventListener")
    tweets.querySelectorAll("a.mark").forEach(addEventListener)
    setStatus("twitter GET OK")
  }

  var handleFetch = function (tweetResp) {
    if (tweetResp.ok) {
      setStatus("insertAdjacentHTML")

      tweetResp.json().then(handleJson)
    } else {
      tweetResp.text().then(setErrorStatus)
    }
  }

  fetch("/.netlify/functions/twitter?since_id=" + id_str).then(handleFetch)
}
