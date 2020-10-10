%%raw(`
const getUsers = tweets => {
  const screenNames = tweets.map(tweet => tweet.user.screen_name)
console.log('raw')
  return screenNames.reduce(reducer, {})
  function reducer(users, screenName) {
    return {
      ...users,
      [screenName]: users[screenName] ? users[screenName] + 1 : 1
    }
  }
}

export { getUsers }
`)
