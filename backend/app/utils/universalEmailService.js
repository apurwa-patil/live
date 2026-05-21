import nodemailer from 'nodemailer';

// Universal email service that works for all users
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:5000/api/auth/verify-email/${token}`;
  
  console.log('📧 Universal Email Verification Starting...');
  console.log('👤 User Email:', email);
  console.log('📧 Using Gmail:', process.env.EMAIL_USER);
  
  // Clean the app password (remove spaces)
  const cleanAppPassword = process.env.EMAIL_PASS.replace(/\s+/g, '');
  console.log('🔑 App Password length:', cleanAppPassword.length);
  
  // Check if user email is same as your Gmail (for testing)
  const isTestEmail = email === process.env.EMAIL_USER;
  
  // Try Gmail with proper configuration
  try {
    console.log('🔄 Trying Gmail with App Password...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: cleanAppPassword
      }
    });
    
    // Test connection
    await transporter.verify();
    console.log('✅ Gmail connected successfully!');
    
    const mailOptions = {
      from: `"Maharashtra Cultural Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Maharashtra Cultural Platform',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #d32f2f, #ff6b6b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎵 Maharashtra Cultural Platform</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification Required</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to Our Cultural Community! 🎉</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for registering with the Maharashtra Cultural Platform! Please click the button below to verify your email address and complete your registration.
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
                        box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3);">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              Or copy and paste this link:<br>
              <span style="word-break: break-all; color: #666;">${verificationUrl}</span>
            </p>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
              This link will expire in 24 hours. If you didn't create an account, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 Maharashtra Cultural Platform. Preserving our heritage through technology.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📧 Email sent to:', email);
    
    if (isTestEmail) {
      console.log('🎯 Test email sent to your Gmail - check your inbox!');
    } else {
      console.log('📧 Email sent to user:', email);
    }
    
    return { success: true, provider: 'Gmail', info, sentToUser: true };
    
  } catch (error) {
    console.error('❌ Gmail failed:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.log('\n💡 Gmail Authentication Error - Solutions:');
      console.log('1. Make sure 2FA is enabled on your Gmail account');
      console.log('2. Generate a new App Password: https://myaccount.google.com/apppasswords');
      console.log('3. Use "Mail" for app, "Other" for device');
      console.log('4. Copy the 16-character password without spaces');
      console.log('5. Update EMAIL_PASS in .env file\n');
    } else if (error.code === 'EENVELOPE') {
      console.log('\n💡 Email Rejected - This is normal for other addresses!');
      console.log('Gmail often blocks sending to other addresses for security.');
      console.log('Using console fallback for verification...\n');
    }
    
    // Fallback to console - ALWAYS show verification link
    console.log('\n🔄 Showing verification link in console (fallback):');
    console.log('🎉 ================================================');
    console.log('📧 EMAIL VERIFICATION - Maharashtra Cultural Platform');
    console.log('================================================');
    console.log('👤 User Email:', email);
    console.log('🔗 Verification Link:');
    console.log('   ' + verificationUrl);
    console.log('📋 Instructions:');
    console.log('   1. Copy the link above');
    console.log('   2. Paste it in your browser');
    console.log('   3. Your account will be verified');
    console.log('================================================\n');
    
    return { success: true, consoleFallback: true, url: verificationUrl };
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `http://localhost:3000/reset-password/${token}`;
  
  console.log('🔐 Universal Password Reset Starting...');
  console.log('👤 User Email:', email);
  console.log('📧 Using Gmail:', process.env.EMAIL_USER);
  
  // Clean app password (remove spaces)
  const cleanAppPassword = process.env.EMAIL_PASS.replace(/\s+/g, '');
  console.log('🔑 App Password length:', cleanAppPassword.length);
  
  // Check if user email is same as your Gmail (for testing)
  const isTestEmail = email === process.env.EMAIL_USER;
  
  // Try Gmail with proper configuration
  try {
    console.log('🔄 Trying Gmail with App Password for password reset...');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: cleanAppPassword
      }
    });
    
    // Test connection
    await transporter.verify();
    console.log('✅ Gmail connected successfully!');
    
    const mailOptions = {
      from: `"Maharashtra Cultural Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password - Maharashtra Cultural Platform',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #d32f2f, #ff6b6b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎵 Maharashtra Cultural Platform</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password 🔐</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your password. Click the button below to create a new password.
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
                        box-shadow: 0 4px 15px rgba(211, 47, 47, 0.3);">
                Reset Password
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              Or copy and paste this link:<br>
              <span style="word-break: break-all; color: #666;">${resetUrl}</span>
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2024 Maharashtra Cultural Platform. Preserving our heritage through technology.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📧 Email sent to:', email);
    
    if (isTestEmail) {
      console.log('🎯 Test email sent to your Gmail - check your inbox!');
    } else {
      console.log('📧 Password reset email sent to user:', email);
    }
    
    return { success: true, provider: 'Gmail', info, sentToUser: true };
    
  } catch (error) {
    console.error('❌ Gmail failed for password reset:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.log('\n💡 Gmail Authentication Error - Solutions:');
      console.log('1. Make sure 2FA is enabled on your Gmail account');
      console.log('2. Generate a new App Password: https://myaccount.google.com/apppasswords');
      console.log('3. Use "Mail" for app, "Other" for device');
      console.log('4. Copy the 16-character password without spaces');
      console.log('5. Update EMAIL_PASS in .env file\n');
    } else if (error.code === 'EENVELOPE') {
      console.log('\n💡 Email Rejected - This is normal for other addresses!');
      console.log('Gmail often blocks sending to other addresses for security.');
      console.log('Using console fallback for password reset...\n');
    }
    
    // Fallback to console - ALWAYS show reset link
    console.log('\n🔄 Showing password reset link in console (fallback):');
    console.log('🔐 ================================================');
    console.log('📧 PASSWORD RESET - Maharashtra Cultural Platform');
    console.log('================================================');
    console.log('👤 Email:', email);
    console.log('🔗 Password Reset Link:');
    console.log('   ' + resetUrl);
    console.log('📋 Instructions:');
    console.log('   1. Copy the link above');
    console.log('   2. Paste it in your browser');
    console.log('   3. Set your new password');
    console.log('================================================\n');
    
    return { success: true, consoleFallback: true, url: resetUrl };
  }
};
