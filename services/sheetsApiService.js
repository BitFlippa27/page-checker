const { createJwtClient } = require("../middleware/middlewaresExport");
const serviceAccount = require('../coherent-window-405214-47c7aa588fc3.json');



const writeToSheet = (newContent) => {
  console.log("write to sheet");
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
      console.error('The API returned an error: ' + err);
      return;
    }
    console.log('Data updated successfully:', result.data);
  });
}


module.exports = writeToSheet;