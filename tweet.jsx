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
      {getText(retweet, tweet)}
      {d.entities && d.entities.urls && d.entities.urls.length > 0 && (
        <ol>
          {d.entities.urls.map(url => (
            <li className="url-entity" key={url.url}>
              {url.url}:
              <a href={url.url} target="_blank">
                {url.display_url}
              </a>
            </li>
          ))}
        </ol>
      )}
      {d.quoted_status && (
        <div className="quoted">{d.quoted_status.full_text}</div>
      )}
      {d.extended_entities && (
        <div>{d.extended_entities.media.map(getImage)}</div>
      )}
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
    <a href={large} key={image.media_url}>
      <img src={small} width={width} height={height} />
    </a>
  )
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

function getText(retweetStatus, tweetStatus) {
  const data = retweetStatus || tweetStatus

  return unescape(data.full_text)
}
