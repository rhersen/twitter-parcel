type size = {
  w: float,
  h: float,
  resize: string,
}

type sizes = {
  large: size,
  medium: size,
  small: size,
  thumb: size,
}

type variant = {bitrate: float, url: string}

type videoInfo = {
  duration_millis: float,
  variants: array<variant>,
}

type medium = {
  media_url: string,
  sizes: sizes,
  video_info: option<videoInfo>,
}

type url = {
  url: string,
  display_url: string,
}

type entities = {urls: array<url>}

type user = {screen_name: string}

type rec status = {
  full_text: string,
  user: user,
  quoted_status: option<status>,
  entities: entities,
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
  Js.String.replace(url, `<a href="${url}" target="_blank">${dict.display_url}${"</a>"}`, text)
}

let getText = (retweetStatus, tweetStatus) => {
  let data = switch retweetStatus {
  | Some(value) => value
  | None => tweetStatus
  }
  let text = fullText(data)
  Js.Array.reduce(replaceUrlWithLink, text, data.entities.urls)
}

let getRetweeter = (retweet, d) => {
  switch retweet {
  | Some() => " <i>" ++ d.user.screen_name ++ "</i> "
  | None => " "
  }
}

let getUser = (retweet, d) =>
  switch retweet {
  | Some(value) => value.user.screen_name
  | None => d.user.screen_name
  }

let bitrate = variant => {
  variant.bitrate
}

let maxBitrate = (prev, cur) =>
  if bitrate(cur) > bitrate(prev) {
    cur
  } else {
    prev
  }

let getVideoLink = (info: option<videoInfo>) => {
  let variants = switch info {
  | Some(value) => value.variants
  | None => []
  }
  if Js.Array.length(variants) == 0 {
    ""
  } else {
    let best = Js.Array.reduce(maxBitrate, {bitrate: 0., url: ""}, variants)
    let duration_millis = switch info {
    | Some(value) => value.duration_millis
    | None => 0.
    }
    let duration = j`$duration_millis ms`
    `<a href="${best.url}">${duration}${"</a>"}`
  }
}

let getImage = image => {
  let size = image.sizes.small
  let width = size.w /. 2.
  let height = size.h /. 2.
  let small = image.media_url ++ ":small"
  let large = image.media_url ++ ":large"
  let img = `<img src="${small}" width="$width" height="$height" />`
  let duration = getVideoLink(image.video_info)
  `<a href="${large}">${img}${"</a>"}${duration}`
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
  }
}
`
)
