const colors = require('colors');
const Diff = require('diff');
const cron = require('node-cron');
const { writeToSheet } = require('./googleAuth.js');

const oldPageContent = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><link rel="icon" href="/favicon.ico"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="Web site created using create-react-app"/><link rel="apple-touch-icon" href="/apple-touch-icon.png"/><link rel="manifest" href="/site.manifest"/><title>Bingo!</title><script defer="defer" src="/static/js/main.fcc1d6d8.js"></script><link href="/static/css/main.0953709d.css" rel="stylesheet"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div></body></html>`;




const retryCheckPageChanges = async (retryCount = 0) => {
  const retryLimit = 20;
  const retryDelay = 5000;
  try {
    await checkPageChanges();
  } catch (error) {
    console.error(`Error in checkPageChanges: ${error.message}`);
    if (retryCount < retryLimit) {
      console.log(`Retrying checkPageChanges (${retryCount + 1}/${retryLimit})`);
      setTimeout(async() => await retryCheckPageChanges(retryCount + 1), retryDelay);
    } else {
      console.error('checkPageChanges failed after maximum retries');
      //send mail to admin
    }
  }
}

cron.schedule('*/15 * * * * *', () => { 
  try {
    checkPageChanges();
  } catch (error) {
    console.error(`Error in checkPageChanges trying again: ${error.message}`);
    retryCheckPageChanges();
  }
});

const checkPageChanges = async () => {
  const trackingData = await getTrackingData();
  const { newPageContent } = trackingData; 

  if (oldPageContent !== newPageContent) {
    process.stdout.write("Bingo! The content has changed \n");
    printContentChanges(trackingData);
  }
}

const getTrackingData = async () => {
  //Error handling ?
  const start = Date.now();
  const response = await fetchWebContent();
  const end = Date.now();
  const loadingTime = end - start;
  const httpStatus = response.status;
  const newContent = await response.text();

  return { loadingTime, httpStatus, newContent };
}

const fetchWebContent = async () => {
  let response;
  try {
    response = await fetch('http://localhost:3000');
    return response;
  
  } catch (error) {
    if (!response.ok) {
      throw new Error(`Couldn't fetch web content! HTTP Status Code: ${response.status}`);
    }
    else {
      throw new Error(`Error: ${error}`);
    }
  }
} 


const printContentChanges = async (trackingData) => {
  const {httpStatus, loadingTime, newContent} = trackingData;

  const changes = Diff.diffWords(oldPageContent, newContent);
  let finalChanges = "";
  changes.forEach((part) => {
    // green for additions, red for deletions
    let text = part.added ? colors.green(part.value):
                part.removed ? colors.bgRed(part.value) :
                part.value;
    
    finalChanges = finalChanges.concat(text);

  });

  writeToSheet(finalChanges);
  process.stdout.write(finalChanges);
  process.stdout.write(`HTTP Status: ${httpStatus} \n`);
  process.stdout.write(`Loading Time: ${loadingTime}ms \n`);
}


exports.checkPageChanges = checkPageChanges;