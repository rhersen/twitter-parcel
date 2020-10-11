let screenName = tweet => tweet["user"]["screen_name"]
let users = Js.Dict.empty()

let reducer = screenName => {
  Js.Dict.set(users, screenName, Js.Dict.unsafeGet(users, screenName) + 1)
  users
}

%%raw(`
const getUsers = tweets => {
  const screenNames = tweets.map(screenName)

  screenNames.forEach(reducer)
  Object.keys(users).forEach(key => users[key] = users[key] + 1)
  return users
}

export { getUsers }
`)
