const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
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

  for (const [filename, dimensions] of Object.entries(mockupDimensions)) {
    const filePath = path.join(mockupsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filename}`);
      continue;
    }

    try {
      console.log(`📤 Uploading ${filename} (${dimensions.width}x${dimensions.height})...`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'plwgs-creative-apparel/mockups',
        public_id: filename.replace('.png', ''),
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
        resource_type: 'image'
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

  // Generate the updated HTML with Cloudinary URLs
  console.log('📝 Generating updated image URLs...\n');
  
  const htmlUpdates = Object.entries(results).map(([filename, data]) => {
    const slideNumber = filename.replace('mockup', '').replace('.png', '');
    return {
      old: `src="/mockups/${filename}"`,
      new: `src="${data.url}"`,
      slide: slideNumber
    };
  });

  console.log('🔄 HTML Updates needed:');
  htmlUpdates.forEach(update => {
    console.log(`   Slide ${update.slide}: ${update.old} → ${update.new}`);
  });

  return { results, htmlUpdates };
}

// Run the upload
uploadMockups()
  .then(({ results, htmlUpdates }) => {
    console.log('\n🎉 Upload complete!');
    console.log(`📊 Total images uploaded: ${Object.keys(results).length}`);
    
    const totalBytes = Object.values(results).reduce((sum, img) => sum + img.bytes, 0);
    console.log(`📦 Total size: ${(totalBytes / 1024).toFixed(1)}KB`);
    console.log(`💾 Average size per image: ${(totalBytes / Object.keys(results).length / 1024).toFixed(1)}KB`);
    
    console.log('\n✨ Next steps:');
    console.log('1. Update homepage.html with the new Cloudinary URLs');
    console.log('2. Test the performance improvements');
    console.log('3. Run PageSpeed Insights again');
  })
  .catch(error => {
    console.error('❌ Upload failed:', error);
  });
