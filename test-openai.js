// Simple test script to verify OpenAI integration
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: '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'
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API connection...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful career coach. Respond briefly."
        },
        {
          role: "user",
          content: "What is React in 1 sentence?"
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    console.log('✅ OpenAI API is working!');
    console.log('Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message);
  }
}

testOpenAI();






