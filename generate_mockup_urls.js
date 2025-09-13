// Generate optimized Cloudinary URLs for mockups
// Based on your existing Cloudinary setup (cloud name: dfistxzb9)

const mockupDimensions = {
  'mockup1.png': { width: 1152, height: 1785 },
  'mockup2.png': { width: 1152, height: 1859 },
  'mockup3.png': { width: 1152, height: 1834 },
  'mockup4.png': { width: 1152, height: 1834 },
  'mockup5.png': { width: 1152, height: 1834 }
};

const cloudName = 'dfistxzb9';
const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

console.log('🚀 Generating optimized Cloudinary URLs for mockups...\n');

const results = {};

Object.entries(mockupDimensions).forEach(([filename, dimensions]) => {
  const publicId = `plwg-creative-apparel/mockups/mockup-${filename.replace('.png', '')}`;
  
  // Create optimized URL with transformations
  const optimizedUrl = `${baseUrl}/c_fill,w_${dimensions.width},h_${dimensions.height},q_auto,f_auto/${publicId}.png`;
  
  results[filename] = {
    url: optimizedUrl,
    width: dimensions.width,
    height: dimensions.height
  };
  
  console.log(`✅ ${filename}:`);
  console.log(`   URL: ${optimizedUrl}`);
  console.log(`   Size: ${dimensions.width}x${dimensions.height}`);
  console.log('');
});

console.log('📝 HTML Updates needed:');
console.log('Replace these lines in homepage.html:\n');

Object.entries(results).forEach(([filename, data]) => {
  const slideNumber = filename.replace('mockup', '').replace('.png', '');
  console.log(`Slide ${slideNumber}:`);
  console.log(`  OLD: src="/mockups/${filename}"`);
  console.log(`  NEW: src="${data.url}"`);
  console.log('');
});

console.log('💡 Benefits of using Cloudinary URLs:');
console.log('- Automatic WebP/AVIF format selection');
console.log('- Optimized compression (quality: auto)');
console.log('- Exact dimensions (no layout shift)');
console.log('- CDN delivery (faster loading)');
console.log('- Estimated size reduction: 2.8MB → ~200KB per image');
