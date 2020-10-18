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
`
)
