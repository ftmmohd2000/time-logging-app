import { send, setApiKey } from "@sendgrid/mail";

export const sendEmail = async (
  recipient: string,
  subject: string,
  message: string
) => {
  setApiKey(process.env.SENDGRID_API_KEY as string);

  const msg = {
    to: recipient,
    from: "mmotorwa@iu.edu",
    subject,
    text: message
  };
  try {
    await send([msg]);
  } catch (error) {
    console.log("something's not right");
    console.log(error.response.body.errors);
  }
};
