import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

async function main() {
  dotenv.config({ path: '.development.env' });
  const transporter = nodemailer.createTransport({
    host: process.env.IMAP_HOST,
    port: 25,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: process.env.IMAP_USER,
    subject: 'Hello',
    html: '<b>Hello there!</b>',
  });

  console.log('Message sent: %s', info.messageId);
}

main().catch(console.error);
