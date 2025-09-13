const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary exactly like your admin upload
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    url: process.env.CLOUDINARY_URL
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Mockup files to upload
const mockupFiles = [
  'mockup1.png',
  'mockup2.png', 
  'mockup3.png',
  'mockup4.png',
  'mockup5.png'
];

async function uploadMockups() {
  console.log('🚀 Uploading mockups to Cloudinary using admin upload method...\n');
  
  const results = {};

  for (const filename of mockupFiles) {
    const filePath = path.join(__dirname, 'mockups', filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filename}`);
      continue;
    }

    try {
      console.log(`📤 Processing ${filename}...`);
      
      // Read file and convert to base64 (like admin upload does)
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString('base64');
      const mimeType = 'image/png';
      const base64Image = `data:${mimeType};base64,${base64Data}`;
      
      // Create public ID for mockups
      const publicId = `plwg-creative-apparel/mockups/mockup-${filename.replace('.png', '')}`;
      
      console.log(`☁️ Uploading ${filename} to Cloudinary...`);
      
      // Upload using the same method as admin upload
      const result = await cloudinary.uploader.upload(
        base64Image,
        {
          public_id: publicId,
          folder: 'plwg-creative-apparel',
          resource_type: 'image',
          overwrite: true,
          use_filename: false
        }
      );

      results[filename] = {
        url: result.secure_url,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        format: result.format
      };

      console.log(`✅ ${filename} uploaded successfully!`);
      console.log(`   URL: ${result.secure_url}`);
      console.log(`   Size: ${result.width}x${result.height}`);
      console.log(`   File size: ${(result.bytes / 1024).toFixed(1)}KB`);
      console.log(`   Format: ${result.format}\n`);

    } catch (error) {
      console.error(`❌ Error uploading ${filename}:`, error.message);
    }
  }

  return results;
}

// Run the upload
uploadMockups()
  .then((results) => {
    if (Object.keys(results).length === 0) {
      console.log('\n❌ No images were uploaded. Please check your Cloudinary credentials.');
      return;
    }

    console.log('\n🎉 Upload complete!');
    console.log(`📊 Total images uploaded: ${Object.keys(results).length}`);
    
    const totalBytes = Object.values(results).reduce((sum, img) => sum + img.bytes, 0);
    console.log(`📦 Total size: ${(totalBytes / 1024).toFixed(1)}KB`);
    console.log(`💾 Average size per image: ${(totalBytes / Object.keys(results).length / 1024).toFixed(1)}KB`);
    
    console.log('\n✨ Next steps:');
    console.log('1. Update homepage.html with the new Cloudinary URLs');
    console.log('2. Test the performance improvements');
    console.log('3. Run PageSpeed Insights again');
    
    // Generate the HTML updates with optimized URLs
    console.log('\n🔄 HTML Updates needed:');
    Object.entries(results).forEach(([filename, data]) => {
      const slideNumber = filename.replace('mockup', '').replace('.png', '');
      const optimizedUrl = data.url.replace('/upload/', '/upload/c_fill,w_1152,h_1785,q_auto,f_auto/');
      console.log(`Slide ${slideNumber}:`);
      console.log(`  OLD: src="/mockups/${filename}"`);
      console.log(`  NEW: src="${optimizedUrl}"`);
      console.log('');
    });
  })
  .catch(error => {
    console.error('❌ Upload failed:', error);
  });
