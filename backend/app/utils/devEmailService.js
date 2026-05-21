// Development mode - auto-verify users without email
export const sendVerificationEmail = async (email, token) => {
  console.log('🚀 Development Mode: Auto-verifying user...');
  console.log('👤 Email:', email);
  console.log('✅ User automatically verified (no email required)');
  
  return { success: true, devMode: true };
};

export const sendPasswordResetEmail = async (email, token) => {
  console.log('🚀 Development Mode: Password reset link in console...');
  console.log('👤 Email:', email);
  console.log('🔗 Reset token:', token);
  console.log('✅ Use token: http://localhost:3000/reset-password/' + token);
  
  return { success: true, devMode: true };
};
