import http from "node:http";
import main from "../main.js";
import { config } from "../config/configExport.js";


const startServer = async () => {
  try {
    config.connectMongoDB();
    const server = http.createServer(async (req, res) => {
      res.end("Server is running...");
    });
    server.listen(7777, () => {
      console.log("Server is running on port 7777"); //process.env
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
