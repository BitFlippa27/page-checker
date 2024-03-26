import cron from "node-cron";
import  { writeToGoogleSheet }  from "./third-parties/sheetsApiService.js";
import { getAllWebsites, saveWebsiteData } from "./repositories/repositoriesExport.js";
import { fetchWebContent } from "./controllers/controllersExport.js";

import {
  createWebsiteData,
  checkPageChanges,
  getContentChanges,
  printAllData,
} from "./services/servicesExport.js";

const main = async () => {
  const websites = await getAllWebsites();

  cron.schedule("*/10 * * * * *", async () => {
    console.log("Running cron job");

    for (const website of websites) {
      try {
        const response = await fetchWebContent(website.url);
        if (response) {
          const websiteData = await createWebsiteData(response, website);
          await checkPageChanges(websiteData);
          //if no contentchanges continue
          const contentChanges = getContentChanges(websiteData);
          writeToGoogleSheet(contentChanges);
          printAllData(websiteData, contentChanges);
          await saveWebsiteData(websiteData);
        }
       else {
        continue;
       }
      } catch (error) {
        console.error(`Error in cron job: ${error.message}`);
        throw new Error("Error");
      }
    }
  });
};

export default main;
