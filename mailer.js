const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = (email) => {
  const verifyURL = `${process.env.BASE_URL}/verify?email=${email}`;
  return transporter.sendMail({
    from: `"SaaS App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email',
    html: `<h2>Welcome to our SaaS!</h2><p>Click below to verify your email:</p><a href="${verifyURL}">✅ Verify Now</a>`,
  });
};

module.exports = sendVerificationEmail;
