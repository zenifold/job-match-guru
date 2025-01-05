const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy extension files
const extensionFiles = [
  'manifest.json',
  'popup.html',
  'content.js',
  'background.js',
  'popup.js'
];

extensionFiles.forEach(file => {
  fs.copyFileSync(
    path.join(__dirname, 'extension', file),
    path.join(distDir, file)
  );
});

// Copy icons
const iconsDir = path.join(distDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

['icon16.png', 'icon48.png', 'icon128.png'].forEach(icon => {
  fs.copyFileSync(
    path.join(__dirname, 'extension', 'icons', icon),
    path.join(iconsDir, icon)
  );
});

console.log('Extension built successfully in dist/ directory');