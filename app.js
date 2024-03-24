const colors = require("colors");
const Diff = require("diff");
const cron = require("node-cron");
const writeToSheet = require("./googleApi.js");
const websiteDataSchema = require("./models/websiteData.mongo.js");
const { websiteData, getAllWebsites }  = require("./models/websiteData.model.js");
const urls = require("./models/urls.js");
 


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

const checkPageChanges = async (websiteDataObject) => {
  console.log("checkPageChanges");
  try {
    const trackingData = await getTrackingData(websiteDataObject);

    if (!trackingData) {
      return;
    }
    //Hash checking ?
    const { newPageContent } = trackingData;
    if (oldPageContent !== newPageContent) {
      process.stdout.write("Bingo! The content has changed \n");
      printContentChanges(trackingData);
    } else {
      process.stdout.write("No changes in the content \n");
      return;
    }
  } catch (error) {
    console.log(`Error in checkPageChanges ${error.message}`);
  }
};

const getTrackingData = async (websiteDataDbObject) => {
  let { url, webContent }  = websiteDataDbObject;
  let { httpStatus, loadingTime, newContent, changeDate } = websiteData;

  try {
    const start = Date.now();
    const response = await fetchWebContent(url);
    if (!response) {
      return;
    }
    const end = Date.now();
    loadingTime = end - start;
    changeDate = new Date();
    httpStatus = response.status;
    newContent = await response.text();

    return { url, loadingTime, httpStatus, webContent, newContent, changeDate };
  } catch (error) {
    console.log(`Error in getTrackingData: ${error.message}`);
  }
};

const fetchWebContent = async (url) => {
  let response;

  try {
    //response = new Response();
    response = await fetch(url);
    return response;
  } catch (error) {
    if (response) {
      console.error(
        `Error in fetchWebContent: Couldn't fetch web content! HTTP Status: ${response.status}`
      );
    } else if (!response) {
      console.log(
        `Error in fetchWebContent: Couldn't fetch web content: ${error.message}`
      );
    } else {
      console.error(
        `Error in fetchWebContent Couldn't fetch web content: ${error.message}`
      );
    }
  }
};

const printContentChanges = (trackingData) => {
  const { url, httpStatus, loadingTime, webContent, newContent, changeDate } = trackingData;

  const changes = Diff.diffWords(webContent, newContent);
  let finalChanges = "";
  changes.forEach((part) => {
    // green for additions, red for deletions
    let text = part.added
      ? colors.green(part.value)
      : part.removed
      ? colors.bgRed(part.value)
      : part.value;

    finalChanges = finalChanges.concat(text);
  });

  writeToSheet(finalChanges);
  process.stdout.write(finalChanges);
  process.stdout.write(`HTTP Status: ${httpStatus} \n`);
  process.stdout.write(`Loading Time: ${loadingTime}ms \n`);
  process.stdout.write(`Date of change: ${changeDate} \n`);
  process.stdout.write(`Website: ${url} \n`);
  

  saveToDb(trackingData);
};

const saveToDb = async (trackingData) => {
  const { url, httpStatus, loadingTime, newContent, changeDate } = trackingData;

  try {
    await websiteDataSchema.create({
      url: url,
      httpStatus: httpStatus,
      loadingTime: loadingTime,
      webContent: newContent,
      changeDate: changeDate,
    });
  } catch (error) {
    console.log(`Error in saveToDB: ${error.message}`);
  }
};

const timeScheduler = cron.schedule("*/10 * * * * *", async () => {
  console.log("Running cron job");
  const websites = await getAllWebsites(); 
  for (const websiteDataDbObject of websites) {
    try {
      await checkPageChanges(websiteDataDbObject);
    } catch (error) {
      console.log(`Error in cron job: ${error.message}`);
      throw new Error("Error");
    }
  }
});

module.exports = timeScheduler;
