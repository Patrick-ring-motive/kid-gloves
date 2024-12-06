
  


globalThis.sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

void async function() {
  await sleep(1000);

  try {
    let x = new Set();
    x.add(document.getElementsByTagName('head'));
    document.querySelector(Symbol('div')).innerText = document.getElementsByTagName('head');
  } catch (e) {
    document.querySelector('div').innerText = e.message
  }

}();