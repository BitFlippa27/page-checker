import { MONGO_URL } from "../config/configExport";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
  } catch (error) {
   console.error(error);
  }
  
  mongoose.connection.on("open", () => {
    console.log(`MongoDB connection ready`);
  });
  
  mongoose.connection.on("error", (error) => {
    console.error(`MongoDB connection error: ${error.message}`);
  });
}

export { connectMongoDB }
