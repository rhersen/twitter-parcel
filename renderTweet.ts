import {
  Medium,
  QuotedStatus,
  RetweetedStatus,
  Status,
  Url,
  Variant,
  VideoInfo
} from "./Status"

export default function renderTweet(tweet: Status): string {
  const retweet: RetweetedStatus = tweet.retweeted_status

  const time: string = tweet.created_at
    ? tweet.created_at.substr(8, 8)
    : "When?"
  const user: string = getUser(retweet, tweet)
  const image: string = getImages(retweet || tweet)

  const a = `<a href='https://twitter.com/${user}/status/${tweet.id_str}' target="_blank">${time}</a>`
  const i: string = getRetweeter(retweet, tweet)
  const b = `<b>${user}</b>`
  const text: string = getText(retweet, tweet)
  const images: string = image && `<div>${image}</div>`
  const quote: string = getQuote(retweet || tweet)

  return `<li>${a}${i}${b} ${text} ${quote} ${images}</li>`

  function getImages(d: RetweetedStatus | Status): string {
    if (!d.extended_entities || !d.extended_entities.media) return ""

    return d.extended_entities.media
      .filter(isPhoto)
      .map(getImage)
      .join("")

    function isPhoto(img: Medium) {
      return (
        img.type === "photo" ||
        img.type === "video" ||
        img.type === "animated_gif"
      )
    }

    function getImage(image: Medium): string {
      const size = image.sizes.small
      const width = size.w / 2
      const height = size.h / 2
      const small = `${image.media_url}:small`
      const large = `${image.media_url}:large`
      // noinspection HtmlRequiredAltAttribute
      const img = `<img src="${small}" width="${width}" height="${height}" />`
      const duration = getVideoLink(image.video_info, image.type)
      return `<a href="${large}">${img}</a>${duration}`
    }

    function getVideoLink(info: VideoInfo, imageType: string): string {
      if (!info || !info.variants || !info.variants.length) return ""
      const best = info.variants.reduce(maxBitrate)
      const duration = info.duration_millis
        ? `${info.duration_millis}ms`
        : imageType
      return `<a href="${best.url}">${duration}</a>`
    }

    function maxBitrate(prev: Variant, cur: Variant): Variant {
      return bitrate(cur) > bitrate(prev) ? cur : prev
    }

    function bitrate(variant: Variant): number {
      return variant.bitrate || 0
    }
  }
}

function getUser(retweet: RetweetedStatus, d: Status): string {
  return retweet && retweet.user
    ? retweet.user.screen_name
    : d.user
    ? d.user.screen_name
    : "Who?"
}

function getRetweeter(retweet: RetweetedStatus, d: Status): string {
  return retweet && d.user && d.user.screen_name
    ? ` <i>${d.user.screen_name}</i> `
    : " "
}

function getText(retweetStatus: RetweetedStatus, tweetStatus: Status): string {
  const data: RetweetedStatus | Status = retweetStatus || tweetStatus

  return data.entities
    ? data.entities.urls.reduce(replaceUrlWithLink, fullText(data))
    : fullText(data)

  function replaceUrlWithLink(text: string, url: Url): string {
    return text.replace(
      url.url,
      `<a href="${url.url}" target="_blank">${url.display_url || url.url}</a>`
    )
  }
}

function getQuote(d: RetweetedStatus | Status): string {
  const quotedStatus: QuotedStatus = d.quoted_status
  return quotedStatus
    ? `<div class="quoted">${fullText(quotedStatus)}</div>`
    : ""
}

function fullText(data: Status | QuotedStatus): string {
  return data.full_text && data.full_text.replace(/\n/g, "<br>")
}
