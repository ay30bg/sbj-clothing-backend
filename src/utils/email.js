const nodemailer = require("nodemailer");

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can switch to another SMTP provider
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASS, // App password for Gmail
      },
    });

    const mailOptions = {
      from: `"SBJ Clothings" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Email sending error:", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
