import http from "node:http";
import main from "./main.js";
import { config } from "./env/envExport.js"
import { connectMongoDB } from "./connections/connectionsExport.js";
config();
//to work with more websites invoke addUrl() after database is connected
// import it from websiteRepositoriesExport

const PORT_NUMBER = process.env.PORT_NUMBER;


const startServer = async () => {
  try {
    connectMongoDB();
    const server = http.createServer(async (req, res) => {
      res.end("Server is running...");
    });
    server.listen(PORT_NUMBER, () => {
      console.log(`Server is running on port ${PORT_NUMBER}`); 
    });
    server.on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });
  } catch (error) {
    console.error(`Error in startServer: ${error.message}`);
  }
};

connectMongoDB();
startServer();
main();
