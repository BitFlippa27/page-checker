const { google } = require('googleapis');
const fs = require('fs');
const serviceAccount = require('./coherent-window-405214-47c7aa588fc3.json');


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



const writeToSheet = (newContent) => {
  const sheets = createJwtClient();
  sheets.spreadsheets.values.update({
    spreadsheetId: '1yRgaCuDJ2zL7pGSru-3qimB43GIPk4T5BGuwk3Byuho',
    range: 'Sheet1!A1', // Specify the starting cell to write data
    valueInputOption: 'RAW',
    resource: {
      values: [
        [newContent] 
      ]
    }
  }, (err, result) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    console.log('Data updated successfully:', result.data);
  });
}

writeToSheet();


exports.writeToSheet = writeToSheet;