const nodemailer = require("nodemailer");

// Create transporter ONCE (not every email send)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: `"Kickoff Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      ...(html && { html }), // add html if provided
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("EMAIL ERROR:", error.message);
    throw error;
  }
};

module.exports = sendEmail;