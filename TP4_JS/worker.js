onmessage = function(e) {
  console.log('Worker: Message received from main script');
  const result = parseInt(e.data[0]) * parseInt(e.data[1]);
  if (isNaN(result)) {
    postMessage('Please write two numbers');
  } else {
    const workerResult = 'Result: ' + result;
    console.log('Worker: Posting message back to main script');
    postMessage(workerResult);
  }
}