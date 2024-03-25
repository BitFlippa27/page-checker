const colors = require("colors");
const Diff = require("diff");
const websiteDataSchema = require("../models/websiteData.mongo.js");
const { websiteData } = require("../models/websiteData.model.js");
const urls = require("./urls.js");

const oldPageContent = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><link rel="icon" href="/favicon.ico"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="Web site created using create-react-app"/><link rel="apple-touch-icon" href="/apple-touch-icon.png"/><link rel="manifest" href="/site.manifest"/><title>Bingo!</title><script defer="defer" src="/static/js/main.fcc1d6d8.js"></script><link href="/static/css/main.0953709d.css" rel="stylesheet"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div></body></html>`;

const checkPageChanges = async (trackingData) => {
  try {
    const { webContent, fetchedWebContent } = trackingData;
    if (webContent !== fetchedWebContent) {
      process.stdout.write("Bingo! The content has changed \n");
      return true;
    } else {
      process.stdout.write("No changes in the content \n");
      return false;
    }
  } catch (error) {
    console.log(`Error in checkPageChanges ${error.message}`);
  }
};

const createTrackingData = async (websiteDataDbObject) => {
  let { url, webContent } = websiteDataDbObject;
  let { httpStatus, loadingTime, fetchedWebContent, changeDate } = websiteData;

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
    fetchedWebContent = await response.text();

    return { url, loadingTime, httpStatus, webContent, fetchedWebContent, changeDate };
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

const getContentChanges = (trackingData) => {
  const { webContent, fetchedWebContent } = trackingData;
  const changes = Diff.diffWords(webContent, fetchedWebContent);
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

  return finalChanges;
};

const printAllData = (trackingData, contentChanges) => {
  const { url, httpStatus, loadingTime, webContent, newContent, changeDate } =
    trackingData;
  process.stdout.write(contentChanges);
  process.stdout.write(`HTTP Status: ${httpStatus} \n`);
  process.stdout.write(`Loading Time: ${loadingTime}ms \n`);
  process.stdout.write(`Date of change: ${changeDate} \n`);
  process.stdout.write(`Website: ${url} \n`);
};

const saveToDb = async (trackingData) => {
  const { url, httpStatus, loadingTime, fetchedWebContent, changeDate } = trackingData;

  try {
    await websiteDataSchema.create({
      url: url,
      httpStatus: httpStatus,
      loadingTime: loadingTime,
      webContent: fetchedWebContent,
      changeDate: changeDate,
    });
  } catch (error) {
    console.log(`Error in saveToDB: ${error.message}`);
  }
};

module.exports = {
  checkPageChanges,
  createTrackingData,
  getContentChanges,
  printAllData,
  saveToDb,
};
