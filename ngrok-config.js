// 🌐 Ngrok Configuration Helper

// This file helps you configure your app to work with ngrok

// Step 1: Get your ngrok URL
// When you run: ngrok http 5000
// You'll get a URL like: https://abc123.ngrok.io

// Step 2: Update your frontend configuration
// In client/src/App.js or wherever you define API_BASE_URL:

const NGROK_URL = 'https://your-ngrok-url.ngrok.io'; // Replace with your actual ngrok URL
const API_BASE_URL = `${NGROK_URL}/api`;

// Step 3: Update your environment variables
// Create client/.env.local file:
/*
REACT_APP_API_URL=https://your-ngrok-url.ngrok.io/api
*/

// Step 4: Update your backend CORS settings (if needed)
// In server/index.js, make sure CORS allows your ngrok domain:
/*
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-ngrok-url.ngrok.io' // Add your ngrok URL here
  ],
  credentials: true
}));
*/

// Step 5: Test your setup
// 1. Start your backend: cd server && npm start
// 2. Start your frontend: cd client && npm start  
// 3. Start ngrok: ngrok http 5000
// 4. Update the API_BASE_URL with your ngrok URL
// 5. Test the application

export { NGROK_URL, API_BASE_URL };
