const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Telmo Academy <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'SendinBlue', // no need to set host or port etc.
      auth: {
        user: process.env.SENDINBLUE_USERNAME,
        pass: process.env.SENDINBLUE_PASSWORD
      }
    });

    // if (process.env.NODE_ENV === 'production') {
    // Sendgrid
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    // }

    return nodemailer.createTransport({
      host: config.get('EMAIL_HOST'),
      port: config.get('EMAIL_PORT'),
      auth: {
        user: config.get('EMAIL_USERNAME'),
        pass: config.get('EMAIL_PASSWORD')
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: "supertelmo@mailsac.com",
      // to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    console.log("mailOptions");
    console.log("from", mailOptions.from);
    // console.log("to", mailOptions.to);
    //console.log("to", "supertelmo@mailsac.com");
    console.log("subject", mailOptions.subject);

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
    console.log("Email Sent...");
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Telmo Academy!');
  }

  async sendThankYou() {
    await this.send('thankYou', `Enjoy your new courses at Telmo Academy`);
  }

  async subscriptionWelcome() {
    await this.send('subscriptionWelcome', `Your subscription is ready`);
  }

  async subscriptionCancellation() {
    await this.send('subscriptionCancellation', `Telmo Academy Membership Cancellation`);
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};