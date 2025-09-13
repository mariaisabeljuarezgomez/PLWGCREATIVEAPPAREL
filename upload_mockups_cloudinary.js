const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// You need to set these environment variables before running:
// $env:CLOUDINARY_API_KEY="your_api_key"
// $env:CLOUDINARY_API_SECRET="your_api_secret"

cloudinary.config({
  cloud_name: 'dfistxzb9', // Your cloud name from existing URLs
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const mockupFiles = [
  'mockup1.png',
  'mockup2.png', 
  'mockup3.png',
  'mockup4.png',
  'mockup5.png'
];

async function uploadMockups() {
  console.log('🚀 Uploading mockups to Cloudinary...\n');
  
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.log('❌ Missing Cloudinary credentials!');
    console.log('Please set:');
    console.log('$env:CLOUDINARY_API_KEY="your_api_key"');
    console.log('$env:CLOUDINARY_API_SECRET="your_api_secret"');
    return;
  }

  for (const filename of mockupFiles) {
    const filePath = path.join(__dirname, 'mockups', filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filename}`);
      continue;
    }

    try {
      console.log(`📤 Uploading ${filename}...`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'plwg-creative-apparel/mockups',
        public_id: `mockup-${filename.replace('.png', '')}`,
        resource_type: 'image',
        overwrite: true
      });

      console.log(`✅ ${filename} uploaded: ${result.secure_url}`);
      
    } catch (error) {
      console.error(`❌ Error uploading ${filename}:`, error.message);
    }
  }
}

uploadMockups();
