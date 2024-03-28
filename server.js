import http from "node:http";
import main from "./main.js";
import { config } from "./env/envExport.js";
import { connectMongoDB } from "./connections/connectionsExport.js";
//import { addUrl } from "./repositories/repositoriesExport.js";

/*
currently the code checks 4 websites which i have control over: 
- https://bingo-game-phi.vercel.app/ 
- https://erdelean.me/
- https://celeb-detect.onrender.com/
- https://webshop27.netlify.app/
- http://localhost:3000/ (e.g. the local bingo game)
to add more websites import addUrl from websiteRepositoriesExport and 
invoke addUrl(url) somewhere after database is connected and
*/
config();

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
