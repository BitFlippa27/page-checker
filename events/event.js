import EventEmitter from "node:events";
import { sendSMS } from "../services/third-parties/smsService.js";
import { sendEmail } from "../services/third-parties/emailService.js";

const emitter = new EventEmitter();

emitter.on("send-sms", (payload) => {
  console.log(`send-sms Event fired, Website: ${payload} has changed!`);
  sendSMS(payload);
});

emitter.on("send-email", (payload) => {
  console.log(`send-email Event fired Website: ${payload} has changed!`);
  sendEmail(payload);
});

export { emitter };
