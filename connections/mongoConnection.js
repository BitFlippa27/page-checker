import mongoose from "mongoose";
import { config } from "../env/envExport.js"
config();

const mongoUrl = process.env.MONGO_URL;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
  } catch (error) {
    console.error(error);
  }

  mongoose.connection.on("open", () => {
    console.log(`MongoDB connection ready`);
  });

  mongoose.connection.on("error", (error) => {
    console.error(`MongoDB connection error: ${error.message}`);
  });
};


export { connectMongoDB, mongoose };
