import * as Diff from "diff";
import colors from "colors";

const getWebsiteResponses = async (websites) => {
  let validResponses = [];


  let response;
  for (const website of websites) {
    const { url } = website;
    try {
      response = await fetch(url);
      } catch (error) {
        console.error(`Could not fetch ${url} ${error.message}`)
      }
      if (response?.ok) {
        validResponses.push(response);
      }
      else {
        console.error(`HTTP Response Code: ${response?.status}`);
        continue;
      }
  }

  return validResponses;
}; 

const createMonitoringInfos = async (newWebSiteData) => {
const newWebContent = await newWebSiteData.text();
const loadingTime = await newWebSiteData.endTime - await newWebSiteData.startTime;
  
  try {
    const monitoringInfos = {
      url: await newWebSiteData.url,
      loadingTime: loadingTime,
      httpStatus: await newWebSiteData.status,
      newWebContent: newWebContent,
      changeDate: Date.now()
    };
    
    return monitoringInfos;
   

  } catch (error) {
    console.error(`Error in createWebsiteData: ${error.message}`);
  }
};

const checkContentChanges = async (newWebsiteData, websites) => {
  
  for (const website of websites) {
    const webContent  = website.webContent;
    console.log("webContent",webContent)
    const newWebContent = await newWebsiteData.newWebContent;
    console.log("newWebContent",newWebContent)
    try {
      if (webContent !== newWebContent) {
        console.log("Bingo! The content has changed \n");
        //trigger event ?!
        return { webContent, newWebContent }
      } else if (!webContent) {
        console.log("New Url!");
        //addUrl
        return false;
      } else {
        console.log("No changes in the content \n");
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
