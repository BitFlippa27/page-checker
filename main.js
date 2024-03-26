import cron from "node-cron";
import  { writeToGoogleSheet }  from "./third-parties/sheetsApiService.js";
import { getAllWebsites, saveWebsiteData } from "./repositories/repositoriesExport.js";
import { fetchWebContent } from "./controllers/controllersExport.js";

import {
  createWebsiteData,
  checkContentChanges,
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
        if (!response) {
          continue;
        }
        const websiteData = await createWebsiteData(response, website);
          
        if (await checkContentChanges(websiteData)) {
          const contentChanges = getContentChanges(websiteData);
          writeToGoogleSheet(contentChanges);
          printAllData(websiteData, contentChanges);
          await saveWebsiteData(websiteData);
        }
      
      } catch (error) {
        console.error(`Error in cron job: ${error.message}`);
        throw new Error("Error");
      }
    }
  });
};

export default main;
