const oldPageContent = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><link rel="icon" href="/favicon.ico"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="Web site created using create-react-app"/><link rel="apple-touch-icon" href="/apple-touch-icon.png"/><link rel="manifest" href="/site.manifest"/><title>Bingo!</title><script defer="defer" src="/static/js/main.fcc1d6d8.js"></script><link href="/static/css/main.0953709d.css" rel="stylesheet"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div></body></html>`;

const delay = (ms) => {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
};
const retryCheckPageChanges = async (retryCount = 0) => {
  const retryLimit = 20;
  const retryDelay = 5000;

  try {
    await checkPageChanges();
  } catch (error) {
    console.error(`Error in checkPageChanges: ${error.message}`);
    if (retryCount < retryLimit) {
      console.log(
        `Retrying checkPageChanges (${retryCount + 1}/${retryLimit})`
      );
      delay(retryDelay);
      retryCheckPageChanges(retryCount + 1);
    } else {
      console.error("checkPageChanges failed after maximum retries");
      //send mail to admin
    }
  }
};


const urls = [
  "http://localhost:3000",
  "https://bingo-game-phi.vercel.app/",
];
