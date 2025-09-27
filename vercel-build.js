const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
    // Install root dependencies
    console.log('📦 Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Install server dependencies
    console.log('📦 Installing server dependencies...');
    execSync('cd server && npm install', { stdio: 'inherit' });

    // Install client dependencies
    console.log('📦 Installing client dependencies...');
    execSync('cd client && npm install', { stdio: 'inherit' });

    // Build the client
    console.log('🔨 Building client...');
    execSync('cd client && npm run build', { stdio: 'inherit' });

    console.log('✅ Vercel build completed successfully!');

} catch (error) {
    console.error('❌ Vercel build failed:', error.message);
    process.exit(1);
}
