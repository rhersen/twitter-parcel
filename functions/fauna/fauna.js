/* eslint-disable */
const faunadb = require('faunadb');

const q = faunadb.query;

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

async function lastRead() {
  try {
    const ret = await faunaClient.query(q.Get(q.Match(q.Index('all_last_read'))));
    console.log(ret);
    return ret;
  } catch (e) {
    console.error(e);
  }
}

async function mark(ref, id_str) {
  try {
    await faunaClient.query(q.Replace(ref, {data: {id_str}}));
  } catch (e) {
    console.error(e);
  }
}

exports.handler = async function (event, context) {
  try {
    const response = await lastRead();
    console.log(response);
    if (!response.data) {
      // NOT res.status >= 200 && res.status < 300
      return {statusCode: response.requestResult.statusCode};
    }

    return {
      statusCode: 200, body: JSON.stringify(response.data)
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500, body: JSON.stringify({msg: err.message}) // Could be a custom message or object i.e.
                                                                // JSON.stringify(err)
    };
  }
};
