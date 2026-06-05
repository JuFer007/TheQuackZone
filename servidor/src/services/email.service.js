const nodemailer = require('nodemailer')
const config = require('../config')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.appPassword,
  },
})

async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: `"TheQuackZone" <${config.email.user}>`,
    to,
    subject,
    html,
  }

  const info = await transporter.sendMail(mailOptions)
  return info
}

module.exports = { sendEmail }
