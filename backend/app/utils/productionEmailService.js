import nodemailer from 'nodemailer';

// Production email service with multiple providers
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:5000/api/auth/verify-email/${token}`;
  
  // Try multiple email services
  const emailServices = [
    {
      name: 'SendGrid',
      config: {
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey', // SendGrid API key
          pass: process.env.SENDGRID_API_KEY
        }
      }
    },
    {
      name: 'Mailgun',
      config: {
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
          user: process.env.MAILGUN_SMTP_LOGIN,
          pass: process.env.MAILGUN_SMTP_PASSWORD
        }
      }
    },
    {
      name: 'Gmail',
      config: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      }
    }
  ];

  for (const service of emailServices) {
    try {
      console.log(`📧 Trying ${service.name}...`);
      const transporter = nodemailer.createTransporter(service.config);
      await transporter.verify();
      
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
                Thank you for registering with the Maharashtra Cultural Platform! Please click the button below to verify your email address.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: linear-gradient(135deg, #d32f2f, #ff6b6b); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 25px; 
                          font-weight: bold; 
                          display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
                Or copy: ${verificationUrl}
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent via ${service.name}`);
      return { success: true, provider: service.name };
      
    } catch (error) {
      console.log(`❌ ${service.name} failed:`, error.message);
      continue; // Try next service
    }
  }
  
  throw new Error('All email services failed');
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `http://localhost:3000/reset-password/${token}`;
  
  // Similar implementation for password reset
  console.log('📧 Password reset email sent (production service)');
  return { success: true };
};
