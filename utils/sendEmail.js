const nodeMailer = require("nodemailer");

const sendEmail = async (option) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_NAME,
    to: option.to,
    subject: option.subject,
    text: option.text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
