import twilio from "twilio";
import { config } from "../../env/envExport.js";
config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const sendSMS = async (url) => {
  await client.messages.create({
    body: "The content has changed on " + url,
    from: "+19163475693",
    to: "+4915257019799",
  });
};

export { sendSMS };
