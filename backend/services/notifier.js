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

  // Auto-feed new inquiry into WhatsApp Shared Inbox
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const port = process.env.PORT || 5000;
    fetch(`http://localhost:${port}/api/whatsapp/inbound`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: inquiry.email || '918247758835',
        contactName: inquiry.name,
        text: `🔥 New Web Form Inquiry (${inquiry.service}): "${inquiry.message}"`,
        message: inquiry.message
      })
    }).catch(e => console.warn('Local WhatsApp auto-feed notice:', e.message));
  } catch (e) {}
}

module.exports = {
  notifyNewInquiry
};
