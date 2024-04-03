import cron from "node-cron";
import { getWebsiteResponses } from "../services/servicesExport.js";
import { filterReachableWebsites } from "../utils/utilsExports.js";
import { iterateWebsites } from "../services/servicesExport.js";
import { getAllWebsites } from "../repositories/repositoriesExport.js";

/**
 * @function startMonitoring
 * @description Starts the monitoring process. It fetches the websites from the MongoDB database and starts a cron job.
 * The cron job is scheduled to run every 10 seconds. For each website, it fetches the current content,
 * compares it with the previously stored content from the database, and detects any changes.
 */
const startMonitoring = () => {
  console.log("Starting monitoring...");

  cron.schedule("*/10 * * * * *", async () => {
    let websites;
    try {
      websites = await getAllWebsites();
    } catch (error) {
      console.error(`Error in getAllWebsites from DB ${error.message}`)
    } 

    let validResponses;
    let reachableWebsites;
    try {
      // Collecting only good responses
      validResponses = await getWebsiteResponses(websites);
    } catch (error) {
      console.error(`Error when fetching ${error.message}`);
    }
    if (validResponses.length !== websites.length) {
      try {
        //Remove bad responses
        reachableWebsites = filterReachableWebsites(websites, validResponses);
        iterateWebsites(reachableWebsites, websites);
      } catch (error) {
        console.error(`Error in iterateWebsite with reachableWebsites ${error.message}`);
      }
    } else {
      try {
        iterateWebsites(validResponses, websites);
      } catch (error) {
        console.error(`Error in iterateWebsite with validResponses ${error.message}`);
      }
    }
  });
};

export { startMonitoring };
