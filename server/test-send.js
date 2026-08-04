import nodemailer from 'nodemailer';

async function testEmail() {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'belkhammesyacine@gmail.com',
      pass: 'atelipeimymmgedi',
    },
    debug: true, // Show SMTP traffic
    logger: true // Log information to console
  });

  try {
    console.log('Sending test email (Text only, no HTML)...');
    const info = await transport.sendMail({
      from: 'belkhammesyacine@gmail.com',
      to: 'belkhammesyacine@gmail.com',
      subject: 'Test Email 2',
      text: 'This is a simple text email. No HTML. Just checking if delivery works.'
    });
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (err) {
    console.error('❌ Email sending failed:');
    console.error(err);
  }
}

testEmail();
