const faunadb = require("faunadb")

const q = faunadb.query

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

async function lastRead() {
  return await faunaClient.query(q.Get(q.Match(q.Index("all_last_read"))))
}

async function mark(ref, id_str) {
  return await faunaClient.query(q.Replace(ref, { data: { id_str } }))
}

exports.handler = async function({ httpMethod, body }) {
  console.log(httpMethod, body)
  try {
    if (httpMethod === "GET") {
      const response = await lastRead()
      console.log(response)
      if (!response.data)
        return { statusCode: response.requestResult.statusCode }

      return {
        statusCode: 200,
        body: JSON.stringify(response.data)
      }
    }

    if (httpMethod === "PUT") {
      const db = await lastRead()
      const newVar = await mark(db.ref, body)
      console.log("mark", newVar)
      return {
        statusCode: 200,
        body: "ok"
      }
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: err.requestResult ? err.requestResult.statusCode : 500,
      body: err.message // Could be a custom message or object i.e.
    }
  }
}
