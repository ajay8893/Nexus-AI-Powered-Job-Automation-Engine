# 🚀 Nexus - AI-Powered Job Automation Engine

**Nexus** is an expert-level full-stack system designed to automate the job search lifecycle. It moves beyond simple application tracking by integrating real-time job scraping, AI-driven resume tailoring, and deep data analytics.

## 🛑 The Problem

The modern job market is a volume game. Recruiters use Applicant Tracking Systems (ATS) and AI to filter candidates, and candidates respond by "blind-applying" to hundreds of roles. This creates a "Black Hole" effect where quality resumes are lost in the noise because they weren't explicitly tailored to specific job descriptions. 

## 💡 The Solution

Nexus is an end-to-end automation engine that treats the job hunt like a data-driven sales funnel. It doesn't just track applications; it engineers them. By scraping job board requirements and using Google Gemini AI to stream tailored resumes, it ensures every application is naturally optimized for the specific keywords and intent of the role.

---

## 🛠️ Core Engineering Highlights

- **Real-time Resume Tailoring (Streaming):** Leverages the Google Gemini API (`@google/generative-ai`) to stream ATS-optimized resumes with zero perceived latency directly to the Next.js frontend.
- **Smart Keyword Analysis:** Interactive two-phase workflow that analyzes a job description to identify missing technical keywords, allowing users to select which keywords to bridge before generating the tailored resume.
- **Multi-Resume Master Management:** Upload and manage multiple base resumes, giving users the flexibility to select specialized core resumes to act as the "Master" source for AI generation.
- **Bulletproof State Management:** A robust job application tracker built with typed statuses, managing the full application lifecycle (Bookmarked → Applied → Interviewing → Offered → Rejected). 
- **Data Intelligence Dashboard:** Real-time analytics tracking applications over time, calculating interview rates, and logging keyword match frequencies against market demands.
- **Type-Safe Architecture:** End-to-end type safety using TypeScript and validation via Zod, guaranteeing data integrity from the web scraper to the MongoDB database.

---

## 🏗️ Technical Stack

### **Frontend (Client)**
- **Framework:** Next.js 16 (App Router), React 19
- **Styling UI:** Tailwind CSS v4, shadcn/ui, Radix UI
- **State & Data:** React Hook Form, Recharts (for Dashboard visualizations)
- **File Uploads:** UploadThing

### **Backend (Server)**
- **Framework:** Node.js, Express (TypeScript)
- **Database:** MongoDB (using Mongoose ODM)
- **Authentication:** Better Auth
- **AI/LLM Engine:** Google Gemini (`@google/generative-ai`) for high-quality, streaming content generation
- **Web Scraping:** Puppeteer, Cheerio
- **Validation:** Zod

---

## 📂 Project Structure

This uses a decoupled frontend and backend architecture:

```
Nexus-AI-Powered-Job-Automation-Engine/
├── client/                 # Next.js 16 User Interface
│   ├── app/                # App Router containing UI logic
│   ├── components/         # Reusable React components (shadcn ui)
│   └── package.json        
├── server/                 # Node.js + Express Backend Services
│   ├── src/                # Core business logic, Controllers, Services
│   ├── models/             # Mongoose schemas
│   └── package.json
├── PRD.md                  # Complete Product Requirements Document
└── README.md               # You are here
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB connection string (Atlas or local)
- Google Gemini API Key
- UploadThing API Key

### 1. Clone the repository
```bash
git clone https://github.com/your-username/nexus-ai-engine.git
cd nexus-ai-engine
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the necessary keys (MongoDB, Gemini API, BetterAuth configurations).
```bash
# Run the development server
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal tab
cd ../client
npm install
```
Create a `.env.local` file in the `client` directory matching any necessary frontend environment variables.
```bash
# Run the Next.js frontend
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 📈 Future Roadmap

- **Chrome Extension:** To easily clip job descriptions from any job board directly to the Nexus board, bypassing scraper-blocking tools.
- **Automated Email Follow-ups:** Integrating background jobs (BullMQ/Redis) to nudge recruiters if no reply is received.
- **Cover Letter Generation:** Utilizing the same streaming Gemini engine to write role-specific cover letters.
