import { fetchWebContent } from "../controllers/controllersExport.js";
import { Diff } from "diff";

const createTrackingData = async (websiteDataDbObject) => {
  const { url, webContent } = websiteDataDbObject;

  try {
    const start = Date.now();
    const response = await fetchWebContent(url);
    if (!response) {
      return;
    }
    let loadingTime = Date.now() - start;
    let fetchedWebContent = await response.text();

    const websiteData = {
      url,
      loadingTime,
      httpStatus: response.status,
      webContent: fetchedWebContent,
      changeDate: new Date() - start,
    };

    return websiteData;
  } catch (error) {
    console.error(`Error in getTrackingData: ${error.message}`);
  }
};

const checkPageChanges = async (trackingData) => {
  try {
    const { webContent, fetchedWebContent } = trackingData;
    if (webContent !== fetchedWebContent) {
      process.stdout.write("Bingo! The content has changed \n");
      return true;
    } else if (!webContent) {
      console.log("New Url!");

      return false;
    } else {
      process.stdout.write("No changes in the content \n");
      return false;
    }
  } catch (error) {
    console.error(`Error in checkPageChanges ${error.message}`);
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
  const { url, httpStatus, loadingTime, changeDate } = trackingData;

  process.stdout.write(contentChanges);
  process.stdout.write(`HTTP Status: ${httpStatus} \n`);
  process.stdout.write(`Loading Time: ${loadingTime}ms \n`);
  process.stdout.write(`Date of change: ${changeDate} \n`);
  process.stdout.write(`Website: ${url} \n`);
};

export {
  createTrackingData,
  checkPageChanges,
  getContentChanges,
  printAllData,
};
