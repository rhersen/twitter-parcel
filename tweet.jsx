import React from "react" // eslint-disable-line no-unused-vars
import { unescape } from "lodash"
export default tweet => {
  const retweet = tweet.retweeted_status

  const time = tweet.created_at ? tweet.created_at.substr(8, 8) : "When?"
  const user = getUser(retweet, tweet)
  const d = retweet || tweet

  return (
    <li>
      <a className="mark" id_str={tweet.id_str}>
        {time}
      </a>{" "}
      <i>{getRetweeter(retweet, tweet)}</i> <b>{user}</b>{" "}
      {getText(retweet || tweet)}
      {d.entities && d.entities.urls && d.entities.urls.length > 0 && (
        <ol>
          {d.entities.urls.map(url => (
            <li className="url-entity" key={url.url}>
              {url.url}:{" "}
              <a href={url.url} target="_blank">
                {url.display_url}
              </a>
            </li>
          ))}
        </ol>
      )}
      {d.quoted_status && (
        <div className="quoted">{getText(d.quoted_status)}</div>
      )}
      {d.extended_entities && d.extended_entities.media.map(getImage)}
    </li>
  )
}

function getImage(image) {
  const size = image.sizes.small
  const width = size.w / 2
  const height = size.h / 2
  const small = `${image.media_url}:small`
  const large = `${image.media_url}:large`
  return (
    <div key={image.media_url}>
      <a href={large}>
        <img src={small} width={width} height={height} />
      </a>
      {getVideoLink(image.video_info, image.type)}
    </div>
  )
}

function getVideoLink(info, imageType) {
  if (!info || !info.variants || !info.variants.length) return
  const best = info.variants.reduce(maxBitrate)
  const duration = info.duration_millis
    ? `${info.duration_millis}ms`
    : imageType
  return <a href={best.url}>{duration}</a>
}

function maxBitrate(prev, cur) {
  return bitrate(cur) > bitrate(prev) ? cur : prev
}

function bitrate(variant) {
  return variant.bitrate || 0
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
    ? d.user.screen_name
    : undefined
}

function getText(data) {
  return data.full_text
    .split("\n")
    .map((s, key) => <div key={key}>{unescape(s)}</div>)
}
