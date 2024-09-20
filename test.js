
globalThis.sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

void async function() {
  await sleep(1000);

  try {
    let x = Set();
    x.add('a');
    document.querySelector('div').innerText = [...x];
  } catch (e) {
    document.querySelector('div').innerText = e.message
  }

}();