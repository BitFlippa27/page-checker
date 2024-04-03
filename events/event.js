import EventEmitter from "node:events";
import { sendSMS } from "../services/third-parties/smsService.js";
import { sendEmail } from "../services/third-parties/emailService.js";

const contentChanged = new EventEmitter();

contentChanged.on("send-sms", (url) => {
  console.log(`send-sms Event fired, Website: ${url} has changed!`);
  sendSMS(url);
});

contentChanged.on("send-email", (url) => {
  console.log(`send-email Event fired Website: ${url} has changed!`);
  sendEmail(url);
});

export { contentChanged };
