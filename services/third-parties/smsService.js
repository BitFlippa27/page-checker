import twilio from "twilio";

//const accountSid = process.env.TWILIO_ACCOUNT_SID;
//const authToken = process.env.TWILIO_AUTH_TOKEN;

const accountSid = "ACab2a9491da9eb1d25999716678372352";
const authToken = "9e3d354d17aa9cdd403449645ca55e0b";
const client = twilio(accountSid, authToken);

const sendSMS = async (url) => {
  await client.messages.create({
    body: "The content has changed on " + url,
    from: "+19163475693",
    to: "+4915257019799",
  });
};

export { sendSMS }
