import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import tailoredDocumentModel from '../models/tailoredDocument.model.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const aiResponse = async ({
	req,
	res,
	resumeText,
	jobDescription,
	documentId,
	selectedKeywords = [],
}: any) => {
	try {
		const isTargetedTailor = selectedKeywords.length > 0;
		console.log(`Starting Gemini stream with model: gemini-3-flash-preview. Targeted: ${isTargetedTailor}`);
		
		const model = genAI.getGenerativeModel({
			model: 'gemini-3-flash-preview',
			generationConfig: {
				maxOutputTokens: 8000,
				temperature: 0.7,
			},
		});

		const prompt = isTargetedTailor 
			? `
You are an expert Technical Recruiter and ATS Optimizer.
  
  TASK:
  1. Rewrite the "User Resume" to perfectly align with the "Job Description."
  2. **CORE OBJECTIVE**: You MUST naturally and strategically incorporate these specific technical keywords into the resume: ${selectedKeywords.join(', ')}.
  3. Ensure these keywords are placed in relevant context (skills section or bullet points).
  
  STRICT RULES:
  1. Do NOT invent fake job titles or companies.
  2. Rephrase existing bullet points to use the exact terminology found in the "Job Description."
  3. Format the output in clean Markdown under the header:
     - # 🚀 Tailored Resume
  
  USER RESUME:
  ${resumeText}

  JOB DESCRIPTION:
  ${jobDescription}

  OUTPUT:
  Return only the tailored resume starting with the header.
`
			: `
You are an expert Technical Recruiter and ATS Optimizer.
  
  TASK:
  1. Analyze the "User Resume" against the "Job Description."
  2. Identify key technical skills, tools, and methodologies required by the job.
  3. Categorize them into "Existing Keywords" (already in resume) and "Missing Keywords" (in JD but not in resume).
  4. Rewrite the "User Resume" to perfectly align with the "Job Description."
  5. **STRATEGICALLY ADD MISSING KEYWORDS**: If a missing keyword is a natural extension of the user's background (e.g., adding TypeScript if they know JavaScript, or PostgreSQL if they know MongoDB/SQL), incorporate it into the resume naturally.
  
  STRICT RULES:
  1. Do NOT invent fake job titles or companies.
  2. Rephrase existing bullet points to use the exact terminology found in the "Job Description."
  3. Quantify achievements where possible (e.g., "Successfully delivered X using Y, resulting in Z% improvement").
  4. Format the output in clean Markdown with these specific sections:
     - # 📊 Keyword Analysis
     - **Match Score**: [Percentage]%
     - **✅ Existing Keywords**: [Comma-separated list of keywords]
     - **❌ Missing Keywords**: [Comma-separated list of keywords]
     - 
     - # 🚀 Tailored Resume
  
  USER RESUME:
  ${resumeText}

  JOB DESCRIPTION:
  ${jobDescription}

  OUTPUT:
  Return the analysis followed by the tailored resume.
`;

		const result = await model.generateContentStream(prompt);

		// SSE headers
		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');
		res.flushHeaders?.();

		let finalText = '';
		let buffer = '';
		let isClosed = false;

		const pingInterval = setInterval(() => {
			if (!isClosed) {
				res.write(`:\n\n`);
			}
		}, 15000);

		// Handle client disconnect
		res.on('close', () => {
			console.log('Client disconnected');
			isClosed = true;
			clearInterval(pingInterval);
		});

		// SSE streaming
		for await (const chunk of result.stream) {
			console.log('Received chunk from Gemini');
			if (isClosed) {
				console.log('Stream closed, stopping iteration');
				break;
			}

			const text = chunk.text();
			if (!text) {
				console.log('Empty text in chunk');
				continue;
			}

			finalText += text;
			buffer += text;

			if (buffer.length > 50) {
				res.write(`data: ${JSON.stringify({ text: buffer })}\n\n`);
				buffer = '';
			}
		}

		if (buffer && !isClosed) {
			res.write(`data: ${JSON.stringify({ text: buffer })}\n\n`);
		}

		clearInterval(pingInterval);

		// Save to DB
		if (!isClosed) {
			await tailoredDocumentModel.findByIdAndUpdate(documentId, {
				tailoredContent: finalText,
				status: 'completed',
			});
			res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
			res.end();
		}
	} catch (error: any) {
		console.error('AI SERVICE ERROR:', error.message || error);
		if (error.stack) console.error(error.stack);

		await tailoredDocumentModel.findByIdAndUpdate(documentId, {
			status: 'failed',
		});

		res.write(`data: ${JSON.stringify({ error: 'Something went wrong' })}\n\n`);
		res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
		res.end();
	}
};
