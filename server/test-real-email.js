import 'dotenv/config';
import { sendVerificationEmail } from './src/core/lib/email.js';
import { logger } from './src/core/lib/logger.js';

async function run() {
  try {
    console.log('Testing ACTUAL application email.js...');
    console.log('Using SMTP host:', process.env.SMTP_HOST);
    console.log('Using SMTP user:', process.env.SMTP_USER);
    console.log('Using FROM:', process.env.EMAIL_FROM);
    
    // Check if the password has brackets
    if (process.env.SMTP_PASS.includes('[')) {
      console.log('❌ ERROR: SMTP_PASS still has brackets in process.env! You need to restart the server.');
    }

    await sendVerificationEmail('belkhammesyacine@gmail.com', 'test-token-1234');
    console.log('✅ sendVerificationEmail executed successfully!');
  } catch (err) {
    console.error('❌ sendVerificationEmail failed:', err);
  }
}

run();
