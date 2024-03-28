import { google } from "googleapis";
//sry for this mess, havent found a better way to use the google credentials (to include it in the .env file)
import serviceAccount from "../coherent-window-405214-47c7aa588fc3.json" assert { type: "json" };

const createJwtClient = () => {
  try {
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
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
