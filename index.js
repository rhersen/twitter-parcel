console.log('hello world')

document.getElementById('root').insertAdjacentHTML('beforeend', '<span>hello, world</span>')

async function f() {
  let response = await fetch(`/.netlify/functions/fauna`)
  let message = await response.json()
  console.log(message);
  document.getElementById('root').insertAdjacentHTML('beforeend', '<span>' + message.id_str + '</span>')
}

f()
