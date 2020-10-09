export default tweets =>
  tweets
    .map(tweet => tweet.user.screen_name)
    .reduce(
      (users, screenName) => ({
        ...users,
        [screenName]: users[screenName] ? users[screenName] + 1 : 1
      }),
      {}
    )
