import * as Diff from "diff";
import colors from "colors";

const getWebsiteRespones = async (websites) => {
  let validResponses = [];
  let invalidRespones = [];
  let response;
  for (const website of websites) {
    const { url } = website;
    try {
      response = await fetch(url);
      } catch (error) {
        console.error(`Could not fetch ${url} ${error.message}`)
      }
      if (response?.ok) {
        validResponses.push(website);
      }
      else {
        console.error(`HTTP Response Code: ${response?.status}`);
        invalidRespones.push(url);
        continue;
      }
  }

  return { validResponses, invalidRespones }
}; 

const createWebsiteData = async (response, oldWebsiteData) => {
  const { url } = oldWebsiteData;

  try {
    const fetchedWebContent = await response.text();

    const newWebsiteData = {
      url: url,
      loadingTime: 1,
      httpStatus: response.status,
      newWebContent: fetchedWebContent,
      changeDate: Date.now()
    };
    
    return {
      oldWebsiteData,
      newWebsiteData,
    };

  } catch (error) {
    console.error(`Error in createWebsiteData: ${error.message}`);
  }
};

const checkContentChanges = async (websiteData) => {
  const { oldWebsiteData, newWebsiteData } = websiteData;
  const { webContent } = oldWebsiteData;
  const { newWebContent } = newWebsiteData;
  
  try {
    if (webContent !== newWebContent) {
      process.stdout.write("Bingo! The content has changed \n");
      return true;
    } else if (!webContent) {
      console.log("New Url!");
      //addUrl
      return false;
    } else {
      process.stdout.write("No changes in the content \n");
      return false;
    }
  } catch (error) {
    console.error(`Error in checkPageChanges ${error.message}`);
  }
};

const getContentChanges = (websiteData) => {
  const { oldWebsiteData, newWebsiteData } = websiteData;
  const { webContent } = oldWebsiteData;
  const { newWebContent } = newWebsiteData;

  try {
    const changes = Diff.diffWords(webContent, newWebContent);
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
  const { newWebsiteData } = websiteData;
  const { url, httpStatus, loadingTime, changeDate } = newWebsiteData;

  process.stdout.write(contentChanges);
  process.stdout.write(`HTTP Status: ${httpStatus} \n`);
  process.stdout.write(`Loading Time: ${loadingTime}ms \n`);
  process.stdout.write(`Date of change: ${changeDate} \n`);
  process.stdout.write(`Website: ${url} \n`);
};

export {
  getWebsiteRespones,
  createWebsiteData,
  checkContentChanges,
  getContentChanges,
  printAllData,
};
