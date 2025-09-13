const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary with the cloud name I can see from your existing URLs
cloudinary.config({
  cloud_name: 'dfistxzb9',
  api_key: process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET'
});

// Mockup dimensions based on our homepage requirements
const mockupDimensions = {
  'mockup1.png': { width: 1152, height: 1785 },
  'mockup2.png': { width: 1152, height: 1859 },
  'mockup3.png': { width: 1152, height: 1834 },
  'mockup4.png': { width: 1152, height: 1834 },
  'mockup5.png': { width: 1152, height: 1834 }
};

async function uploadMockups() {
  const mockupsDir = path.join(__dirname, 'mockups');
  const results = {};

  console.log('🚀 Starting mockup upload to Cloudinary...\n');
  console.log('⚠️  NOTE: You need to set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET environment variables\n');

  for (const [filename, dimensions] of Object.entries(mockupDimensions)) {
    const filePath = path.join(mockupsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filename}`);
      continue;
    }

    try {
      console.log(`📤 Uploading ${filename} (${dimensions.width}x${dimensions.height})...`);
      
      // Upload with transformations for optimal size and quality
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'plwg-creative-apparel/mockups',
        public_id: `mockup-${filename.replace('.png', '')}`,
        transformation: [
          {
            width: dimensions.width,
            height: dimensions.height,
            crop: 'fill',
            quality: 'auto:good',
            format: 'auto',
            fetch_format: 'auto'
          }
        ],
        resource_type: 'image',
        overwrite: true
      });

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
      console.log('💡 To set credentials, run:');
      console.log('   $env:CLOUDINARY_API_KEY="your_api_key"');
      console.log('   $env:CLOUDINARY_API_SECRET="your_api_secret"');
      console.log('   node upload_mockups_manual.js');
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
    
    // Generate the HTML updates
    console.log('\n🔄 HTML Updates needed:');
    Object.entries(results).forEach(([filename, data]) => {
      const slideNumber = filename.replace('mockup', '').replace('.png', '');
      console.log(`   Slide ${slideNumber}: src="/mockups/${filename}" → src="${data.url}"`);
    });
  })
  .catch(error => {
    console.error('❌ Upload failed:', error);
  });
