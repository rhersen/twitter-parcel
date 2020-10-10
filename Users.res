let screenName = tweet => tweet["user"]["screen_name"]

%%raw(`
const getUsers = tweets => {
  const screenNames = tweets.map(screenName)

  return screenNames.reduce(reducer, {})
}

  function reducer(users, screenName) {
    return {
      ...users,
      [screenName]: users[screenName] ? users[screenName] + 1 : 1
    }
  }

export { getUsers }
`)
