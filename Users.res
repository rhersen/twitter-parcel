let screenName = tweet => tweet["user"]["screen_name"]
let users = Js.Dict.empty()

let zero = screenName => Js.Dict.set(users, screenName, 0)
let reducer = screenName => Js.Dict.set(users, screenName, Js.Dict.unsafeGet(users, screenName) + 1)

%%raw(
  `
const getUsers = tweets => {
  users = {}
  const screenNames = tweets.map(screenName)

  screenNames.forEach(zero)
  screenNames.forEach(reducer)
  return users
}

export { getUsers }
`
)
