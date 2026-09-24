# HireTrack AI 🎯

An AI-powered full-stack MERN application for tracking job applications, parsing resumes, and generating AI-driven job match scores using a pluggable LLM (Gemini/OpenAI).

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **AI:** Gemini API / OpenAI API (pluggable)
- **Auth:** JWT with refresh token rotation
- **Deployment:** Vercel (frontend) + Render (backend)

## Features
- 🔐 Secure JWT authentication with refresh token rotation
- 📄 Resume upload and AI-powered parsing
- 🎯 AI-driven job match scoring
- 📊 Application tracking dashboard with status management
- 🛡️ Rate-limited, validated REST API

## Project Status
🚧 Under active development

## Setup Instructions
## Setup Instructions

### Backend
\`\`\`bash
cd server
npm install
cp .env.example .env   # fill in your own values
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd client
npm install
cp .env.example .env
npm run dev
\`\`\`

## License
MIT