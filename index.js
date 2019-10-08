console.log('hello world')

document.getElementById('root').insertAdjacentHTML('beforeend', '<span>hello, world</span>')

async function f() {
  let response = await fetch(`/.netlify/functions/fauna`)
  console.log(await response.json());
}

f()
