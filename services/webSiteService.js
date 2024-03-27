import * as Diff from "diff";
import colors from "colors";
import { emitter } from "../events/eventsExport.js";

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

const createMonitoringInfos = async (newWebSiteData) => {
  const newWebContent = await newWebSiteData.text();
  
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

const checkContentChanges = async (newWebsiteData, websites) => {
  for (const website of websites) {
    
    const webContent = website.webContent;
    const newWebContent = await newWebsiteData.newWebContent;
    
    try {
      if (webContent !== newWebContent) {
        console.log("Bingo! The content has changed \n");
        emitter.emit("send-sms", newWebsiteData.url);
        //emitter.emit("send-email", newWebsiteData.url);

        return { webContent, newWebContent };
      } else if (!webContent) {
        console.log("New Url!");
        //addUrl
        return !newWebContent;
      } else {
        //console.log("No changes in the content \n");
        return false;
      }
    } catch (error) {
      console.error(`Error in checkPageChanges ${error.message}`);
    }
  }
};

const getContentChanges = (oldWebContent, newWebContent) => {
  try {
    const changes = Diff.diffWords(oldWebContent, newWebContent);
    let finalChangesCmd = "";
    let finalChangesSheets = "";

    changes.forEach((part) => {
      // green for additions, red for deletions
      let text = part.added
        ? colors.green(part.value)
        : part.removed
        ? colors.bgRed(part.value)
        : part.value;

      finalChangesCmd = finalChangesCmd.concat(text);
    });

    changes.forEach((part) => {
      // green for additions, red for deletions
      let text = part.value;

      finalChangesSheets = finalChangesSheets.concat(text);
    });
  
    return { finalChangesSheets, finalChangesCmd };
  } catch (error) {
    console.error(`Error in getContentChanges ${error.message}`);
  }
};

const printAllData = (websiteData, contentChanges) => {
  const { url, httpStatus, loadingTime, changeDate } = websiteData;

  console.log(contentChanges);
  console.log(`HTTP Status: ${httpStatus} \n`);
  console.log(`Loading Time: ${loadingTime}ms \n`);
  console.log(`Date of change: ${changeDate} \n`);
  console.log(`Website: ${url} \n`);
};

export {
  getWebsiteResponses,
  createMonitoringInfos,
  checkContentChanges,
  getContentChanges,
  printAllData,
};
