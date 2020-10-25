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
  duration_millis: option<float>,
  variants: array<variant>,
}

type medium = {
  media_url: string,
  \"type": string,
  sizes: sizes,
  video_info: option<videoInfo>,
}

type url = {
  url: string,
  display_url: string,
}

type entities = {urls: array<url>}

type user = {screen_name: string}

type extendedEntities = {media: array<medium>}

type rec status = {
  created_at: string,
  id_str: string,
  full_text: string,
  user: user,
  retweeted_status: option<status>,
  quoted_status: option<status>,
  entities: entities,
  extended_entities: option<extendedEntities>,
}

let renderTweet = tweet => {
  let getImages = d => {
    let isPhoto = img => {
      img.\"type" == "photo" || img.\"type" == "video" || img.\"type" == "animated_gif"
    }

    let maxBitrate = (prev, cur) => cur.bitrate > prev.bitrate ? cur : prev

    let getVideoLink = (info: option<videoInfo>) => {
      let variants = switch info {
      | Some(value) => value.variants
      | None => []
      }
      if Js.Array.length(variants) == 0 {
        ""
      } else {
        let best = Js.Array.reduce(maxBitrate, {bitrate: -0.1, url: ""}, variants)
        let duration_millis = switch info {
        | Some(value) =>
          switch value.duration_millis {
          | Some(value) => value
          | None => 0.
          }
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
      let small = `${image.media_url}:small`
      let large = `${image.media_url}:large`
      let img = j`<img src="${small}" width="$width" height="$height" />`
      let duration = getVideoLink(image.video_info)
      `<a href="${large}">${img}${"</a>"}${duration}`
    }

    switch d.extended_entities {
    | Some(value) =>
      Js.Array.filter(isPhoto, value.media) |> Js.Array.map(getImage) |> Js.Array.joinWith("")
    | None => ""
    }
  }

  let getUser = (retweet, d) =>
    switch retweet {
    | Some(value) => value.user.screen_name
    | None => d.user.screen_name
    }

  let getRetweeter = (retweet, d) => {
    switch retweet {
    | Some(_) => ` <i>${d.user.screen_name}</i> `
    | None => " "
    }
  }

  let fullText = data => {
    Js.String.replaceByRe(%re("/\\n/g"), "<br>", data.full_text)
  }

  let getText = (retweetStatus, tweetStatus) => {
    let replaceUrlWithLink = (text, url) => {
      Js.String.replace(
        url.url,
        `<a href="${url.url}" target="_blank">${url.display_url}${"</a>"}`,
        text,
      )
    }

    let data = switch retweetStatus {
    | Some(value) => value
    | None => tweetStatus
    }
    Js.Array.reduce(replaceUrlWithLink, fullText(data), data.entities.urls)
  }

  let getQuote = d => {
    switch d.quoted_status {
    | Some(quotedStatus) => `<div class="quoted">${fullText(quotedStatus)}${"</div>"}`
    | None => ""
    }
  }

  let retweet = tweet.retweeted_status

  let time = Js.String.substrAtMost(~from=8, ~length=8, tweet.created_at)
  let user = getUser(retweet, tweet)
  let t = switch retweet {
  | Some(value) => value
  | None => tweet
  }
  let image = getImages(t)

  let a =
    `<a href="https://twitter.com/${user}${"/status/"}${tweet.id_str}""" target="_blank">${time}${"</a>"}`
  let i = getRetweeter(retweet, tweet)
  let b = `<b>${user}</b>`
  let text = getText(retweet, tweet)
  let images = `<div>${image}</div>`
  let quote = getQuote(t)

  `<li>${a}${i}${b} ${text} ${quote} ${images}</li>`
}
