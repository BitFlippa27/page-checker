import  EventEmitter from 'node:events';
import { sendSMS } from "../services/third-parties/smsService.js"
import { sendEmail } from '../services/third-parties/emailService.js';

const emitter = new EventEmitter();


// Define a 'fetch-progress' event
emitter.on('send-sms', (payload) => {
  console.log('send-sms Event fired', payload);
  sendSMS(payload);
});

emitter.on('send-email', (payload) => {
  console.log('send-email Event fired', payload);
  sendEmail(payload);
});


export { emitter }