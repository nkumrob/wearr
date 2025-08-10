const fs = require('fs')
const path = require('path')

// Simple placeholder icon generator
const sizes = [192, 512]

sizes.forEach(size => {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#3B82F6"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" fill="white" text-anchor="middle" dy=".3em">W</text>
  </svg>`
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'public', `icon-${size}.svg`),
    svg
  )
})

console.log('Icons generated successfully!')