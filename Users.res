let getUsers = tweets => {
  let users = Js.Dict.empty()
  let screenNames = Js.Array.map(tweet => tweet["user"]["screen_name"], tweets)

  Js.Array.forEach(screenName => Js.Dict.set(users, screenName, 0), screenNames)
  Js.Array.forEach(
    screenName => {
      let count = Js.Dict.unsafeGet(users, screenName)
      Js.Dict.set(users, screenName, count + 1)
    },
    screenNames,
  )
  users
}
