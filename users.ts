import { Status } from "./Status"

export function getUsers(tweetJson: Status[]): Record<string, number> {
  const users: Record<string, number> = {}
  tweetJson.forEach((tweet: Status) => {
    const screenName: string = tweet.user.screen_name
    const found = users[screenName]
    if (found) users[screenName]++
    else users[screenName] = 1
  })
  return users
}
