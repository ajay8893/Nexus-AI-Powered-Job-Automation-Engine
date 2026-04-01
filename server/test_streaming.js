import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const modelsToTest = [
  'gemini-1.5-flash-latest',
  'gemini-2.0-flash-exp',
  'gemini-2.5-flash-lite-preview-09-2025',
  'gemini-3-flash-preview',
];

async function testStreaming(modelName) {
  console.log(`\n--- Testing ${modelName} ---`);
  try {
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        maxOutputTokens: 8000,
        temperature: 0.7,
      },
    });
    const result = await model.generateContentStream('Write a very long, detailed 5-page essay about the future of AI in 2026, including specific predictions for each month of the year.');
    
    let text = '';
    let count = 0;
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      text += chunkText;
      count++;
      if (count % 10 === 0) process.stdout.write('.');
    }
    console.log(`\nSuccess: Generated ${text.length} characters in ${count} chunks.`);
  } catch (error) {
    console.error(`\nFailed on ${modelName}: ${error.message}`);
    if (error.stack) console.error(error.stack);
  }
}

async function runTests() {
  for (const model of modelsToTest) {
    await testStreaming(model);
  }
}

runTests();
