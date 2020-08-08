export interface Hashtag {
  text: string
  indices: number[]
}

export interface UserMention {
  screen_name: string
  name: string
  id: any
  id_str: string
  indices: number[]
}

export interface Url {
  url: string
  expanded_url: string
  display_url: string
  indices: number[]
}

export interface Size {
  w: number
  h: number
  resize: string
}

export interface Sizes {
  large: Size
  medium: Size
  small: Size
  thumb: Size
}

export interface Variant {
  bitrate: number
  content_type: string
  url: string
}

export interface VideoInfo {
  aspect_ratio: number[]
  duration_millis: number
  variants: Variant[]
}

export interface AdditionalMediaInfo {
  monetizable: boolean
}

export interface Medium {
  id: any
  id_str: string
  indices: number[]
  media_url: string
  media_url_https: string
  url: string
  display_url: string
  expanded_url: string
  type: string
  sizes: Sizes
  source_status_id: any
  source_status_id_str: string
  source_user_id: number
  source_user_id_str: string
  video_info: VideoInfo
  additional_media_info: AdditionalMediaInfo
}

export interface ExtendedEntities {
  media: Medium[]
}

export interface QuotedStatusPermalink {
  url: string
  expanded: string
  display: string
}

export interface User {
  id: number
  id_str: string
  name: string
  screen_name: string
  location: string
  description: string
  url: string
  entities: Entities
  protected: boolean
  followers_count: number
  friends_count: number
  listed_count: number
  created_at: string
  favourites_count: number
  utc_offset?: any
  time_zone?: any
  geo_enabled: boolean
  verified: boolean
  statuses_count: number
  lang?: any
  contributors_enabled: boolean
  is_translator: boolean
  is_translation_enabled: boolean
  profile_background_color: string
  profile_background_image_url: string
  profile_background_image_url_https: string
  profile_background_tile: boolean
  profile_image_url: string
  profile_image_url_https: string
  profile_banner_url: string
  profile_link_color: string
  profile_sidebar_border_color: string
  profile_sidebar_fill_color: string
  profile_text_color: string
  profile_use_background_image: boolean
  has_extended_profile: boolean
  default_profile: boolean
  default_profile_image: boolean
  following: boolean
  follow_request_sent: boolean
  notifications: boolean
  translator_type: string
}

export interface ExtendedEntities {
  media: Medium[]
}

export interface RetweetedStatus {
  created_at: string
  id: any
  id_str: string
  full_text: string
  truncated: boolean
  display_text_range: number[]
  entities: Entities
  extended_entities: ExtendedEntities
  source: string
  in_reply_to_status_id?: number
  in_reply_to_status_id_str: string
  in_reply_to_user_id?: number
  in_reply_to_user_id_str: string
  in_reply_to_screen_name: string
  user: User
  geo?: any
  coordinates?: any
  place?: any
  contributors?: any
  is_quote_status: boolean
  retweet_count: number
  favorite_count: number
  favorited: boolean
  retweeted: boolean
  possibly_sensitive: boolean
  possibly_sensitive_appealable: boolean
  lang: string
  quoted_status_id?: number
  quoted_status_id_str: string
  quoted_status_permalink: QuotedStatusPermalink
  quoted_status: QuotedStatus
}

export interface QuotedStatusPermalink2 {
  url: string
  expanded: string
  display: string
}

export interface Entities {
  hashtags: Hashtag[]
  symbols: { text: string; indices: number[] }[]
  user_mentions: UserMention[]
  urls: Url[]
  media: Medium[]
}

export interface QuotedStatusPermalink3 {
  url: string
  expanded: string
  display: string
}

export interface QuotedStatus {
  created_at: string
  id: any
  id_str: string
  full_text: string
  truncated: boolean
  display_text_range: number[]
  entities: Entities
  extended_entities: ExtendedEntities
  source: string
  in_reply_to_status_id?: number
  in_reply_to_status_id_str: string
  in_reply_to_user_id?: number
  in_reply_to_user_id_str: string
  in_reply_to_screen_name: string
  user: User
  geo?: any
  coordinates?: any
  place?: any
  contributors?: any
  is_quote_status: boolean
  retweet_count: number
  favorite_count: number
  favorited: boolean
  retweeted: boolean
  possibly_sensitive: boolean
  possibly_sensitive_appealable: boolean
  lang: string
  quoted_status_id?: number
  quoted_status_id_str: string
  quoted_status_permalink: QuotedStatusPermalink3
}

export interface Status {
  created_at: string
  id: any
  id_str: string
  full_text: string
  truncated: boolean
  display_text_range: number[]
  entities: Entities
  extended_entities: ExtendedEntities
  source: string
  in_reply_to_status_id?: any
  in_reply_to_status_id_str?: any
  in_reply_to_user_id?: any
  in_reply_to_user_id_str?: any
  in_reply_to_screen_name?: any
  user: User
  geo?: any
  coordinates?: any
  place?: any
  contributors?: any
  retweeted_status: RetweetedStatus
  is_quote_status: boolean
  retweet_count: number
  favorite_count: number
  favorited: boolean
  retweeted: boolean
  possibly_sensitive: boolean
  possibly_sensitive_appealable: boolean
  lang: string
  quoted_status_id?: number
  quoted_status_id_str: string
  quoted_status_permalink: QuotedStatusPermalink2
  quoted_status: QuotedStatus
}
