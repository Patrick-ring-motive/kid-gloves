
  


globalThis.sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

void async function() {
  await sleep(1000);

  try {
    document.querySelector('div').innerText = !document.querySelector('poop');
    let c=document.querySelector('poop');
    c.innerText='h';
    document.querySelector('div').appendChild(c);
  } catch (e) {
    document.querySelector('div').innerText = e.message;
  }

}();