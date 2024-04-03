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
invoke addUrl(url) somewhere after database is connected 
*/
config();

try {
  connectMongoDB();
} catch (error) {
  console.error(`Error when connecting to MongoDB ${error.message}`)
}

main();
