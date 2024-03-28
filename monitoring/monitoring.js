import cron from "node-cron";
import { getWebsiteResponses } from "../services/servicesExport.js";
import { filterReachableWebsites } from "../utils/utilsExports.js";
import { iterateWebsites } from "../services/servicesExport.js";
/**
 * Starts monitoring the provided websites.
 * The cron job is scheduled to run every 10 seconds.
 * @param {Object[]} websites - The websites from the database to monitor.
 */

const startMonitoring = (websites) => {
  console.log("Starting monitoring...");

  cron.schedule("*/10 * * * * *", async () => {
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
