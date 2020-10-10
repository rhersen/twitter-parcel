export function getUsers(tweets) {
  return tweets
    .map(tweet => tweet.user.screen_name)
    .reduce(
      (users, screenName) => ({
        ...users,
        [screenName]: users[screenName] ? users[screenName] + 1 : 1
      }),
      {}
    )
}
