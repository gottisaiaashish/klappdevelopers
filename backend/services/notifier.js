/**
 * Notifier Service for KLAPP Developers Backend
 * Logs new inquiry notifications and optionally sends email alerts if SMTP is configured.
 */

async function notifyNewInquiry(inquiry) {
  const logBanner = `
==================================================
📬 NEW INQUIRY RECEIVED [KLAPP DEVELOPERS]
--------------------------------------------------
ID      : ${inquiry.id}
Name    : ${inquiry.name}
Contact : ${inquiry.email}
Service : ${inquiry.service}
Message : ${inquiry.message}
Time    : ${inquiry.createdAt}
==================================================
  `;
  console.log(logBanner);

  // Optional SMTP Email notification if configured in .env
  if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.NOTIFICATION_EMAIL) {
    try {
      // Lazy load nodemailer if available
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"KLAPP Developers Web" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFICATION_EMAIL,
        subject: `🔥 New Web Inquiry from ${inquiry.name} (${inquiry.service})`,
        text: `New Client Inquiry Details:\n\nName: ${inquiry.name}\nContact: ${inquiry.email}\nService Required: ${inquiry.service}\nDetails: ${inquiry.message}\nSubmitted At: ${inquiry.createdAt}`
      });
      console.log('✅ Email notification sent successfully to:', process.env.NOTIFICATION_EMAIL);
    } catch (err) {
      console.warn('⚠️ SMTP notification failed (check .env settings):', err.message);
    }
  }
}

module.exports = {
  notifyNewInquiry
};
