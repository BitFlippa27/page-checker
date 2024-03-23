const colors = require('colors');
const Diff = require('diff');
const { GoogleSpreadsheet } = require('google-spreadsheet');


const doc = new GoogleSpreadsheet('your-google-sheet-id');
const oldPageContent = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><link rel="icon" href="/favicon.ico"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="Web site created using create-react-app"/><link rel="apple-touch-icon" href="/apple-touch-icon.png"/><link rel="manifest" href="/site.manifest"/><title>Bingo!</title><script defer="defer" src="/static/js/main.fcc1d6d8.js"></script><link href="/static/css/main.0953709d.css" rel="stylesheet"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div></body></html>`;

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

const getTrackingData = async () => {
  const start = Date.now();
  const response = await fetchWebContent();
  const end = Date.now();
  const loadingTime = end - start;
  const httpStatus = response.status;
  const newContent = await response.text();

  return { loadingTime, httpStatus, newContent };
}

const checkPageChanges = async () => {
  const trackingData = await getTrackingData();
  const { newPageContent } = trackingData; 

  if (oldPageContent !== newPageContent) {
    process.stdout.write("Bingo! The content has changed \n");
    printContentChanges(trackingData);
  }
}

const printContentChanges = async (trackingData) => {
  const {httpStatus, loadingTime, newContent} = trackingData;

  const changes = Diff.diffWords(oldContent, newContent);
  let finalChanges = "";
  changes.forEach((part) => {
    // green for additions, red for deletions
    let text = part.added ? colors.green(part.value):
                part.removed ? colors.bgRed(part.value) :
                part.value;
    
    finalChanges = finalChanges.concat(text);

  });
  process.stdout.write(finalChanges);
  process.stdout.write(`HTTP Status: ${httpStatus} \n`);
  process.stdout.write(`Loading Time: ${loadingTime}ms \n`);
}
checkPageChanges();
