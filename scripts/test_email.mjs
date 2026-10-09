import nodemailer from 'nodemailer';

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    auth: {
      user: 'founder@ztoitech.com',
      pass: 'hdtamaqpmfwhyghg',
    },
  });

  try {
    const verified = await transporter.verify();
    console.log('SMTP connection verified successfully:', verified);
  } catch (err) {
    console.error('SMTP verification failed:', err);
  }
}

testEmail();
