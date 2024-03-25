import google from "googleapis";
import serviceAccount from '../coherent-window-405214-47c7aa588fc3.json';


const createJwtClient = () => {
  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  jwtClient.authorize((err, tokens) => {
    if (err) {
      console.error('Error authorizing JWT client:', err);
      return;
    }
  });
  const sheets = google.sheets({ version: 'v4', auth: jwtClient });

  return sheets;
}

export { createJwtClient }

