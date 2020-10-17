type url = {
  url: string,
  display_url: option<string>,
}

type entities = {urls: array<url>}

type rec status = {
  full_text: string,
  quoted_status: option<status>,
  entities: option<entities>,
}

let fullText = data => {
  Js.String.replaceByRe(%re("/\\n/g"), "<br>", data.full_text)
}

let getQuote = d => {
  switch d.quoted_status {
  | Some(quotedStatus) => `<div class="quoted">${fullText(quotedStatus)}${"</div>"}`
  | None => ""
  }
}

let replaceUrlWithLink = (text, dict) => {
  let url = dict.url
  let displayUrl = switch dict.display_url {
  | Some(value) => value
  | None => url
  }
  Js.String.replace(url, `<a href="${url}" target="_blank">${displayUrl}${"</a>"}`, text)
}

let getText = (retweetStatus, tweetStatus) => {
  let data = switch retweetStatus {
  | Some(value) => value
  | None => tweetStatus
  }
  let text = fullText(data)
  switch data.entities {
  | Some(value) => Js.Array.reduce(replaceUrlWithLink, text, value.urls)
  | None => text
  }
}
%%raw(
  `
export function renderTweet(tweet) {
  const retweet = tweet.retweeted_status

  const time = tweet.created_at ? tweet.created_at.substr(8, 8) : "When?"
  const user = getUser(retweet, tweet)
  const image = getImages(retweet || tweet)

  const a =
    '<a href="https://twitter.com/' +
    user +
    "/status/" +
    tweet.id_str +
    '""" target="_blank">' +
    time +
    "</a>"
  const i = getRetweeter(retweet, tweet)
  const b = "<b>" + user + "</b>"
  const text = getText(retweet, tweet)
  const images = image && "<div>" + image + "</div>"
  const quote = getQuote(retweet || tweet)

  return "<li>" + a + i + b + " " + text + " " + quote + " " + images + "</li>"

  function getImages(d) {
    if (!d.extended_entities || !d.extended_entities.media) return ""

    return d.extended_entities.media
      .filter(isPhoto)
      .map(getImage)
      .join("")

    function isPhoto(img) {
      return (
        img.type === "photo" ||
        img.type === "video" ||
        img.type === "animated_gif"
      )
    }

    function getImage(image) {
      const size = image.sizes.small
      const width = size.w / 2
      const height = size.h / 2
      const small = image.media_url + ":small"
      const large = image.media_url + ":large"
      // noinspection HtmlRequiredAltAttribute
      const img =
        '<img src="' +
        small +
        '" width="' +
        width +
        '" height="' +
        height +
        '" />'
      const duration = getVideoLink(image.video_info, image.type)
      return '<a href="' + large + '">' + img + "</a>" + duration
    }

    function getVideoLink(info, imageType) {
      if (!info || !info.variants || !info.variants.length) return ""
      const best = info.variants.reduce(maxBitrate)
      const duration = info.duration_millis
        ? info.duration_millis + "ms"
        : imageType
      return '<a href="' + best.url + '">' + duration + "</a>"
    }

    function maxBitrate(prev, cur) {
      return bitrate(cur) > bitrate(prev) ? cur : prev
    }

    function bitrate(variant) {
      return variant.bitrate || 0
    }
  }
}

function getUser(retweet, d) {
  return retweet && retweet.user
    ? retweet.user.screen_name
    : d.user
    ? d.user.screen_name
    : "Who?"
}

function getRetweeter(retweet, d) {
  return retweet && d.user && d.user.screen_name
    ? " <i>" + d.user.screen_name + "</i> "
    : " "
}
`
)
