#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Railway build process...');

try {
    // Step 1: Install root dependencies
    console.log('📦 Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // Step 2: Install server dependencies
    console.log('📦 Installing server dependencies...');
    execSync('cd server && npm install', { stdio: 'inherit' });

    // Step 3: Install client dependencies
    console.log('📦 Installing client dependencies...');
    execSync('cd client && npm install', { stdio: 'inherit' });

    // Step 4: Build React app
    console.log('🏗️ Building React app...');
    execSync('cd client && npm run build', { stdio: 'inherit' });

    // Step 5: Verify build
    const buildPath = path.join(__dirname, 'client', 'build');
    if (fs.existsSync(buildPath)) {
        console.log('✅ React build completed successfully!');
    } else {
        throw new Error('❌ React build failed - build directory not found');
    }

    console.log('🎉 Railway build process completed successfully!');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
