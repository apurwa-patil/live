import nodemailer from 'nodemailer';

// Create a transporter (using Ethereal for testing)
let testAccount = null;

const createTestAccount = async () => {
  try {
    if (!testAccount) {
      testAccount = await nodemailer.createTestAccount();
      console.log('📧 Ethereal test account created:', testAccount.user);
    }
    
    const transporter = nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    console.log('✅ Ethereal transporter created');
    return transporter;
  } catch (error) {
    console.log('❌ Ethereal failed, using Gmail fallback:', error.message);
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
};

let transporter = null;
const getTransporter = async () => {
  if (!transporter) {
    transporter = await createTestAccount();
  }
  return transporter;
};

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:5000/api/auth/verify-email/${token}`;
  
  console.log('📧 Sending verification email to:', email);
  console.log('🔗 Verification URL:', verificationUrl);
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@marathicultural.com',
    to: email,
    subject: 'Email Verification - Maharashtra Cultural Platform',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #d32f2f, #ff6b6b); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎵 Maharashtra Cultural Platform</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to Our Cultural Community! 🎉</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for registering with the Maharashtra Cultural Platform! To complete your registration and start exploring our rich cultural heritage, please verify your email address.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #d32f2f, #ff6b6b); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3);
                      transition: transform 0.3s ease;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Or copy and paste this link into your browser:<br>
            <span style="word-break: break-all; color: #666;">${verificationUrl}</span>
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
              <strong>What you'll get after verification:</strong>
            </p>
            <ul style="color: #666; font-size: 14px; margin-left: 20px;">
              <li>🎵 Access to 500+ Marathi folk songs</li>
              <li>🌸 Explore cultural traditions and festivals</li>
              <li>🧠 AI-powered storytelling features</li>
              <li>👥 Join our vibrant community</li>
            </ul>
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 Maharashtra Cultural Platform. Preserving our heritage through technology.</p>
        </div>
      </div>
    `
  };

  try {
    const transport = await getTransporter();
    console.log('📤 Sending email with transporter...');
    
    const info = await transport.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📧 Email preview URL:', nodemailer.getTestMessageUrl(info));
    
    // Show clear instructions
    console.log('\n🎉 EMAIL SENT SUCCESSFULLY!');
    console.log('� Click the preview URL above to see the email');
    console.log('🔗 Copy the verification link from the email to verify your account\n');
    
    return { success: true, info };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `http://localhost:3000/reset-password/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@marathicultural.com',
    to: email,
    subject: 'Password Reset - Maharashtra Cultural Platform',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #d32f2f, #ff6b6b); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎵 Maharashtra Cultural Platform</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
          <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password 🔐</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            We received a request to reset your password for your Maharashtra Cultural Platform account. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #d32f2f, #ff6b6b); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3);
                      transition: transform 0.3s ease;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Or copy and paste this link into your browser:<br>
            <span style="word-break: break-all; color: #666;">${resetUrl}</span>
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support.
            </p>
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            If you're having trouble clicking the button, copy and paste the URL into your web browser.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 Maharashtra Cultural Platform. Preserving our heritage through technology.</p>
        </div>
      </div>
    `
  };

  try {
    const transport = await getTransporter();
    const info = await transport.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    
    // If using Ethereal, show preview URL
    if (info.messageId && process.env.NODE_ENV !== 'production') {
      console.log('📧 Email preview (Ethereal):', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};
