import nodemailer from 'nodemailer';

async function testEmail() {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: 'belkhammesyacine@gmail.com',
      pass: 'atelipeimymmgedi', // The password from earlier
    },
  });

  try {
    console.log('Testing SMTP connection...');
    await transport.verify();
    console.log('✅ SMTP connection successful!');
  } catch (err) {
    console.error('❌ SMTP verification failed:');
    console.error(err);
  }
}

testEmail();
