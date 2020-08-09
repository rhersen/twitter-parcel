import { Status } from "./Status"

export default (tweets: Status[]): Record<string, number> =>
  tweets
    .map(tweet => tweet.user.screen_name)
    .reduce(
      (users: Record<string, number>, screenName) => ({
        ...users,
        [screenName]: users[screenName] ? users[screenName] + 1 : 1
      }),
      {}
    )
