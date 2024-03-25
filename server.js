const http = require("http");
const mongoose = require("mongoose");
const main = require("./main.js");

const MONGO_URL =
  "mongodb+srv://bitflippa:vI11Lcmr6AHSPQ7q@cluster0.i5cwt1d.mongodb.net/page-checker?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connection.on("open", () => {
  console.log(`MongoDB connection ready`);
});

mongoose.connection.on("error", (error) => {
  console.error(`MongoDB connection error: ${error.message}`);
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    const server = http.createServer(async (req, res) => {
      res.end("Server is running...");
    });
    server.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
    server.on("error", (error) => {
      console.error(`Error: ${error.message}`);
    });
  } catch (error) {
    console.error(`Error in startServer: ${error.message}`);
  }
};

startServer();
main();
