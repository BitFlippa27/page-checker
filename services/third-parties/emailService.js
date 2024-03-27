import mailgun from 'mailgun-js';

const mailgunApiKey = "7b7059975701aab63ceff3cb060db430-f68a26c9-a8142093";
const mailgunDomain = "sandbox2cfa88ffcf3840dd92eadfe18f276be7.mailgun.org"

const mg = mailgun({ apiKey: mailgunApiKey, domain: mailgunDomain });

const sendEmail = async (url) => {
  const data = {
    from: 'toDo',
    to: 'dennis.erdelean@proton.me',
    subject: 'Website content changed',
    text: 'The content has changed on ' + url
  };

  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
}

export { sendEmail }