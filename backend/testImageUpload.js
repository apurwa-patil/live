import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';

// Test image upload
const testImageUpload = async () => {
  try {
    console.log('🧪 Testing image upload...');
    
    // Create a simple test image buffer (1x1 pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'base64'
    );
    
    // Create FormData
    const formData = new FormData();
    formData.append('title', 'Test Contribution with Image');
    formData.append('category', 'Festival');
    formData.append('location', 'Mumbai');
    formData.append('content', 'This is a test contribution with an image upload.');
    
    // Add test image
    formData.append('images', testImageBuffer, {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    
    // Send to backend
    const response = await axios.post('http://localhost:5000/api/community/add', formData, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MWFlYzY5ZjMwZmY5NjA4ZjY2M2I5ZCIsImlhdCI6MTcxMjM2NjQzOCwiZXhwIjoxNzEyMzcwMDM4fQ.test-token',
        ...formData.getHeaders()
      }
    });
    
    console.log('✅ Image upload test successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Image upload test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
};

testImageUpload();
