// utils/email.js
import nodemailer from 'nodemailer';

const createTransporter = () => {
  // For Brevo, replace transport options accordingly and use env variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
    secure: process.env.SMTP_SECURE === 'false' ? false : true, // true for 465
    auth: {
      user: process.env.SMTP_USER, // your email
      pass: process.env.SMTP_PASS, // app password
    },
  });

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return info;
};

export default sendEmail;
