var url = 'https://jsonplaceholder.typicode.com/posts/1';
async function fetchAsync (url) {
    // await response of fetch call
    let response = await fetch(url);
    // only proceed once promise is resolved
    let data = await response.json();
    // only proceed once second promise is resolved
    console.log(data);
    return data;
  };
  //fetchAsync(url);
  await fetch(url);
console.log('after');