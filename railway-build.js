const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Railway build process...');

try {
    // Install root dependencies
    console.log('📦 Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Build React app
    console.log('🏗️ Building React app...');
    execSync('cd client && npm install && npm run build', { stdio: 'inherit' });

    console.log('✅ Railway build completed successfully!');
} catch (error) {
    console.error('❌ Railway build failed:', error.message);
    process.exit(1);
}
