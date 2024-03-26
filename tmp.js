const http = require('http');
const diff = require('diff');
const nodemailer = require('nodemailer');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const cron = require('node-cron');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/monitoring', {useNewUrlParser: true, useUnifiedTopology: true});

const SiteSchema = new mongoose.Schema({
  url: String,
  content: String
});
const Site = mongoose.model('Site', SiteSchema);

const transporter = nodemailer.createTransport({
  service: 'Sendgrid',
  auth: {
    user: 'sendgrid_username',
    pass: 'sendgrid_password'
  }
});

const doc = new GoogleSpreadsheet('google_sheet_id');

cron.schedule('* * * * *', async () => {
  const site = await Site.findOne({url: 'website_url'});
  const request = await http.request(site.url, (res) => {
  res.on("data", (chunk) => {
    console.log(`Data: ${chunk}`);
  })
  res.on("end", () => {
    console.log("No more data in response.");
  })
});

req.end();
  const newContent = response.data;

  if (site.content !== newContent) {
    const changes = diff.diffChars(site.content, newContent);
    site.content = newContent;
    await site.save();

    await transporter.sendMail({
      from: 'your_email',
      to: 'recipient_email',
      subject: 'Website content changed',
      text: `Changes: ${JSON.stringify(changes)}`
    });

    await doc.useServiceAccountAuth({
      client_email: 'client_email',
      private_key: 'private_key'
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({time: new Date(), changes: JSON.stringify(changes)});
  }
});

const oldPageContent = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><link rel="icon" href="/favicon.ico"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="theme-color" content="#000000"/><meta name="description" content="Web site created using create-react-app"/><link rel="apple-touch-icon" href="/apple-touch-icon.png"/><link rel="manifest" href="/site.manifest"/><title>Bingo!</title><script defer="defer" src="/static/js/main.fcc1d6d8.js"></script><link href="/static/css/main.0953709d.css" rel="stylesheet"></head><body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div></body></html>`;

const delay = (ms) => {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
};
const retryCheckPageChanges = async (retryCount = 0) => {
  const retryLimit = 20;
  const retryDelay = 5000;

  try {
    await checkPageChanges();
  } catch (error) {
    console.error(`Error in checkPageChanges: ${error.message}`);
    if (retryCount < retryLimit) {
      console.log(
        `Retrying checkPageChanges (${retryCount + 1}/${retryLimit})`
      );
      delay(retryDelay);
      retryCheckPageChanges(retryCount + 1);
    } else {
      console.error("checkPageChanges failed after maximum retries");
      //send mail to admin
    }
  }
};


const urls = [
  "http://localhost:3000",
  "https://bingo-game-phi.vercel.app/",
];
