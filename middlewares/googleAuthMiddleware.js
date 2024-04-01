import { google } from "googleapis";
import { config } from "../env/envExport.js";
config();

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY} = process.env;

const pk_key = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');


const createJwtClient = () => {
  try {
    const jwtClient = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      null,
      pk_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    jwtClient.authorize((err, tokens) => {
      if (err) {
        console.error("Error authorizing JWT client:", err);
        return;
      }
    });
    const sheets = google.sheets({ version: "v4", auth: jwtClient });

    return sheets;
  } catch (error) {
    console.error(`Error in createJwtClient ${error.message}`);
  }
};

export { createJwtClient };
