import * as Diff from "diff";
import colors from "colors";
import { emitter } from "../events/eventsExport.js";
import { saveWebsiteData } from "../repositories/repositoriesExport.js";
import { writeToGoogleSheet } from "../services/third-parties/thirdPartiesExport.js";


/**
 * Fetches the valid responses from a list of websites.
 * @function getWebsiteResponses
 * @param {Object[]} websites - An array of website objects to fetch responses from.
 * @returns {Promise<Object[]>} - A promise that resolves with an array of response objects.
 * @async
 */ 
const getWebsiteResponses = async (websites) => {
  let validResponses = [];
  let startTime;
  let endTime;
  let response;

  for (const website of websites) {
    const { url } = website;

    try {
      startTime = Date.now();
      response = await fetch(url);
      endTime = Date.now();
    } catch (error) {
      console.error(`Could not fetch ${url} ${error.message}`);
      continue;
    }
    if (response?.ok) {
      const responseClone = response.clone();
      responseClone.loadingTime = endTime - startTime;
      validResponses.push(responseClone);
    } else {
      console.error(`HTTP Response Code: ${response?.status}`);
      continue;
    }
  }
  return validResponses;
};

 /** Iterates over the response objects, checks for content changes, and saves new website data.
 * @function iterateWebsite
 * @param {Object[]} responseObjects - The valid response objects to iterate over.
 * @param {Object[]} websites - The original list of websites from the database.
 * @async
 */
const iterateWebsites = async (responseObjects, websites) => {
  //creates a Map from the websites array, using the url as the key. 
  //allows for efficient lookup of the website data when iterating over the responseObjects
  const websiteMap = new Map(websites.map(website => [website.url, website]));

  for (const responseObject of responseObjects) {
    const website = websiteMap.get(responseObject.url);
    if (!website) continue;

    const newWebsiteData = await createMonitoringInfos(responseObject);
    
    if (await checkContentChanges(newWebsiteData, website)) {
      const { webContent, newWebContent } = await checkContentChanges(
        newWebsiteData,
        website
      );
      const { finalChangesSheets, finalChangesCmd } = getContentChanges(webContent,newWebContent);
      writeToGoogleSheet(finalChangesSheets);
      printAllData(newWebsiteData, finalChangesCmd);
      await saveWebsiteData(newWebsiteData);

    } else {
      continue;
    }
  }
};


const createMonitoringInfos = async (newWebSiteData) => { 
  let newWebContent;
  //Dont know why yet one time its a Response Object and the other time not, when a bad url is passed in getWebsiteResponses
  if (newWebSiteData instanceof Response) {
    newWebContent = await newWebSiteData.text();
  }
  else {
    newWebContent = await newWebSiteData.webContent;
  }
  
  try {
    const monitoringInfos = {
      url: await newWebSiteData.url,
      loadingTime: await newWebSiteData.loadingTime,
      httpStatus: await newWebSiteData.status,
      newWebContent: newWebContent,
      changeDate: Date.now(),
    };

    return monitoringInfos;
  } catch (error) {
    console.error(`Error in createMonitoringInfos: ${error.message}`);
  }
};

 /** Checks if the content of a website has changed and triggers an event.
 * @function checkContentChanges
 * @param {Object} newWebsiteData - The new website.
 * @param {Object} website - The original website.
 * @event send-sms
 * @returns {Promise<Object|boolean>} - A promise that resolves with an object containing the old and new content if the content has changed, or a boolean indicating whether the website is new.
 * @async
 */
const checkContentChanges = async (newWebsiteData, website) => {
  const webContent = website.webContent;
  const newWebContent = await newWebsiteData.newWebContent;

  console.log(`Checking ${website.url}`);
  try {
    if (webContent !== newWebContent) {
      emitter.emit("send-sms", newWebsiteData.url);
      //emitter.emit("send-email", newWebsiteData.url);

      return { webContent, newWebContent };
    } else if (newWebsiteData.loadingTime === 0) {
      console.log("New Url!");
      return !newWebContent;
    } else {
      return !newWebContent;
    }
  } catch (error) {
    console.error(`Error in checkPageChanges ${error.message}`);
  }
};
/**
 * Main functionality, using the diff utility
 * Gets the content changes between the old and new website content.
 * @function getContentChanges
 * @param {string} oldWebContent - The old website content.
 * @param {string} newWebContent - The new website content.
 * @returns {string} - A string that represents the changes between the old and new content. Additions are marked in green and deletions are marked in red.
 */
const getContentChanges = (oldWebContent, newWebContent) => {
  try {
    const changes = Diff.diffWords(oldWebContent, newWebContent);
    let finalChangesCmd = "";
    let finalChangesSheets = "";

    changes.forEach((part) => {
      let text = part.added
        ? colors.green(part.value)
        : part.removed
        ? colors.bgRed(part.value)
        : part.value;

      finalChangesCmd = finalChangesCmd.concat(text);
    });

    changes.forEach((part) => {
      let text = part.value;

      finalChangesSheets = finalChangesSheets.concat(text);
    });

    return { finalChangesSheets, finalChangesCmd };
  } catch (error) {
    console.error(`Error in getContentChanges ${error.message}`);
  }
};


const printAllData = async (websiteData, contentChanges) => {
  const { url, httpStatus, loadingTime, changeDate } = websiteData;

  console.log(contentChanges);
  console.log(`HTTP Status: ${httpStatus} \n`);
  console.log(`Loading Time: ${loadingTime}ms \n`);
  console.log(`Date of change: ${changeDate} \n`);
  console.log(`Website: ${url} \n`);
};

export {
  getWebsiteResponses,
  iterateWebsites,
  createMonitoringInfos,
  checkContentChanges,
  getContentChanges,
  printAllData,
};
