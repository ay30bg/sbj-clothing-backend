const nodemailer = require("nodemailer");

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,        // e.g., smtp.gmail.com
  port: process.env.SMTP_PORT || 587, // usually 587 or 465
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,      // your email
    pass: process.env.SMTP_PASS,      // your email password or app password
  },
});

// Function to send email
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"SBJ Clothings" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
