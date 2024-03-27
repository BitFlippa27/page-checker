import { getAllWebsites, addUrl } from "./repositories/repositoriesExport.js";
import { startMonitoring } from "./monitoring/monitoringsExport.js";

const main = async () => {
  const websites = await getAllWebsites();
  startMonitoring(websites);
};

export default main;


//register service