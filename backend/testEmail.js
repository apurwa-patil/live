import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('📧 Testing Email System...');
console.log('📧 Email User:', process.env.EMAIL_USER);
console.log('🔑 Password Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');

async function testEmail() {
  try {
    // Clean password
    const cleanPass = process.env.EMAIL_PASS.replace(/\s+/g, '');
    console.log('🔑 Cleaned Password Length:', cleanPass.length);
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: cleanPass
      }
    });
    
    console.log('🔄 Testing Gmail connection...');
    await transporter.verify();
    console.log('✅ Gmail connection successful!');
    
    // Send test email
    const mailOptions = {
      from: `"Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test Email - Maharashtra Cultural Platform',
      text: 'This is a test email from your application.',
      html: '<h1>Test Email</h1><p>This is a test email from Maharashtra Cultural Platform.</p>'
    };
    
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📧 Check your inbox!');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Gmail Authentication Error:');
      console.log('1. Check if 2FA is enabled on your Gmail account');
      console.log('2. Generate a new App Password: https://myaccount.google.com/apppasswords');
      console.log('3. Make sure the app password is correct');
      console.log('4. Check if your Gmail address is correct');
    }
  }
}

testEmail();
