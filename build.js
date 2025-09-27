const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
    // Install dependencies if needed
    console.log('📦 Installing client dependencies...');
    execSync('cd client && npm install', { stdio: 'inherit' });

    // Build the client
    console.log('🔨 Building client...');
    execSync('cd client && npm run build', { stdio: 'inherit' });

    // Copy server files to build directory for Vercel
    console.log('📁 Setting up server files...');

    // Create build directory structure
    const buildDir = path.join(__dirname, 'build');
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir, { recursive: true });
    }

    // Copy server files
    const serverFiles = ['server/index.js', 'server/package.json', 'server/careerTopics.json'];
    serverFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const destPath = path.join(buildDir, path.basename(file));
            fs.copyFileSync(file, destPath);
            console.log(`✅ Copied ${file} to build directory`);
        }
    });

    console.log('✅ Build completed successfully!');
    console.log('🌐 Ready for Vercel deployment!');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
