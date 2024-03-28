//couldnt sign up for twilio as the website didnt let me fill out my last name 
//in the form fields when registering, a frontend bug from their side

import mailgun from 'mailgun-js';
import { config } from "../../env/envExport.js"
config();

const mailgunApiKey = process.env.MAILGUN_API_KEY;
const mailgunDomain = process.env.MAILGUN_DOMAIN;

const mg = mailgun({ apiKey: mailgunApiKey, domain: mailgunDomain });

const sendEmail = async (url) => {
  const data = {
    from: 'i have modify my DNS records for the domain',
    to: 'dennis.erdelean@proton.me',
    subject: 'Website content changed',
    text: 'The content has changed on ' + url
  };

  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
}

export { sendEmail }