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