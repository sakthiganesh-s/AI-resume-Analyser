# 🚀 AI Resume Analyzer

AI-powered web application that analyzes resumes and provides ATS (Applicant Tracking System) style feedback, keyword matching, and improvement suggestions using artificial intelligence.

🌐 **Live Demo:** https://ai-resume-analyzer-ivory-psi.vercel.app  
🎥 **Demo Video:** https://www.youtube.com/watch?v=vwf1yrI28TI  

---

## 📋 Table of Contents

- [✨ Features](#features)
- [🏗️ Tech Stack](#tech-stack)
- [📂 Project Structure](#project-structure)
- [⚙️ Setup & Installation](#setup--installation)
- [🔐 Environment Variables](#environment-variables)
- [🧠 How It Works](#how-it-works)
- [📡 API Endpoints](#api-endpoints)
- [🔧 Technologies Explained](#technologies-explained)
- [📌 Notes](#notes)

---

## ✨ Features

* **Resume Analysis**
  - Paste resume text or upload PDF files
  - Automatic PDF parsing and text extraction
  - Support for multiple resume formats

* **ATS Scoring & Feedback**
  - Overall resume quality score (1-10)
  - ATS match score based on job description
  - Structured JSON feedback format
  - Professional evaluation summary

* **Keyword Analysis**
  - Matched keywords from job description
  - Missing keywords detection
  - Keyword density analysis
  - ATS-specific optimization suggestions

* **AI-Generated Suggestions**
  - Personalized improvement recommendations
  - ATS optimization tips
  - Resume structure enhancements
  - Impact-focused bullet point advice

* **User Authentication**
  - JWT-based secure login/signup
  - Password hashing with bcryptjs
  - Protected analysis routes
  - Token-based authorization

* **History & Persistence**
  - Save analysis results to MongoDB
  - View past analyses
  - Delete saved analyses
  - Organized analysis history

* **Demo Mode**
  - Analyze resumes without login
  - No data persistence in demo mode
  - Perfect for testing the application

---

## 🏗️ Tech Stack

### Frontend
* **React 19.2.4** - UI framework
* **Vite 8.0.1** - Fast build tool and dev server
* **Tailwind CSS 4.2.2** - Utility-first CSS framework
* **React Router DOM 7.13.2** - Client-side routing

### Backend
* **Node.js** - JavaScript runtime
* **Express 5.2.1** - Web application framework
* **MongoDB Atlas** - Cloud database
* **Mongoose 9.3.3** - MongoDB ODM

### AI & APIs
* **OpenAI API 6.33.0** - Primary AI model (GPT-4)
* **Groq SDK 1.2.1** - Alternative fast AI model
* **PDF Parse 2.4.5** - PDF text extraction

### Security & Authentication
* **JWT (jsonwebtoken 9.0.3)** - Token-based authentication
* **bcryptjs 3.0.3** - Password hashing
* **Cors 2.8.6** - Cross-origin resource sharing

### Development
* **Nodemon 3.1.14** - Auto-restart server on changes
* **ESLint 9.39.4** - Code quality linter
* **Multer 2.1.1** - File upload handling

---

## 📂 Project Structure

```
AI-Resume-Analyzer/
│
├── client/                          # React Frontend Application
│   ├── src/
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # Entry point
│   │   ├── App.css                 # App styles
│   │   ├── index.css               # Global styles
│   │   ├── assets/                 # Static images & SVGs
│   │   ├── components/
│   │   │   ├── AnalysisCard.jsx    # Resume score display
│   │   │   └── AnalysisSection.jsx # Analysis results section
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Login.jsx           # User login
│   │   │   ├── Signup.jsx          # User registration
│   │   │   ├── Dashboard.jsx       # User dashboard
│   │   │   ├── AnalyzerWorkspace.jsx # Resume analysis interface
│   │   │   ├── History.jsx         # Past analyses
│   │   │   └── Demo.jsx            # Demo mode
│   │   └── index.html              # HTML template
│   ├── package.json
│   ├── vite.config.js              # Vite configuration
│   ├── eslint.config.js            # ESLint rules
│   └── .env.example                # Environment template
│
├── server/                          # Express Backend Application
│   ├── index.js                    # Server entry point
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── analyzerController.js   # Resume analysis logic
│   │   ├── authController.js       # Auth endpoints
│   │   └── messageController.js    # Message handling
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   └── Analysis.js             # Analysis record schema
│   ├── routes/
│   │   ├── analyzerRoutes.js       # Resume analysis routes
│   │   ├── authRoutes.js           # Auth routes
│   │   └── messageRoutes.js        # Message routes
│   ├── package.json
│   ├── .env.example                # Environment template
│   └── node_modules/               # Dependencies
│
├── docs/
│   └── screenshots/                # Documentation images
│
├── README.md                        # This file
└── .gitignore
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** (v20 LTS or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** - [Create Free Account](https://www.mongodb.com/cloud/atlas)
- **OpenAI API Key** OR **Groq API Key** - [Get Keys](https://platform.openai.com/api-keys)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone Repository

```bash
git clone https://github.com/mahir-alam/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

### Step 2: Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example and fill values)
copy .env.example .env

# Start server (runs on http://localhost:5000)
npm run dev
```

### Step 3: Setup Frontend (in new terminal)

```bash
cd client

# Install dependencies
npm install

# Create .env file (copy from .env.example)
copy .env.example .env

# Start frontend (runs on http://localhost:5173)
npm run dev
```

### Step 4: Open Browser

Navigate to `http://localhost:5173` and start analyzing resumes!

---

## 🔐 Environment Variables

### Backend Server (`server/.env`)

```env
# MongoDB Connection String (required)
# Create free cluster at https://www.mongodb.com/cloud/atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster

# AI API Key (choose one: OpenAI OR Groq)
# For OpenAI: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk_...

# For Groq (faster, free): https://console.groq.com/keys
GROQ_API_KEY=gsk_...

# JWT Secret for token signing (create any random string)
JWT_SECRET=your_secret_key_here

# Frontend URL (for CORS configuration)
CLIENT_URL=http://localhost:5173

# Server Port (optional, defaults to 5000)
PORT=5000
```

### Frontend Client (`client/.env`)

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000
```

---

## 🧠 How It Works

### Architecture Flow

```
┌─────────────────┐
│  React Frontend │
│  (Vite + TC)    │
└────────┬────────┘
         │
         │ HTTP/REST API
         ↓
┌─────────────────┐
│ Express Server  │
│  (Node.js)      │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
  MongoDB   OpenAI/Groq
  (Data)    (AI Model)
```

### User Journey

1. **User visits app**
   - Option 1: Use Demo mode (no login)
   - Option 2: Sign up / Login (JWT authentication)

2. **Resume Analysis**
   - User enters resume text OR uploads PDF
   - User enters optional job description
   - Frontend sends request to backend API

3. **Backend Processing**
   - Validates input (resume required, PDF optional)
   - Extracts text from PDF if uploaded
   - Prepares prompt for AI model
   - Sends request to OpenAI or Groq API

4. **AI Analysis**
   - AI model analyzes resume against job description
   - Generates structured JSON feedback
   - Returns scores, keywords, suggestions

5. **Frontend Display**
   - Shows overall score and ATS match score
   - Displays strengths and weaknesses
   - Lists matched and missing keywords
   - Shows ATS and general improvement suggestions

6. **Data Persistence**
   - If authenticated: Analysis saved to MongoDB
   - Users can view history of past analyses
   - Users can delete analyses

---

## 📡 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register          # Create new user account
POST   /api/auth/login             # User login, returns JWT token
```

### Resume Analysis Endpoints

```
POST   /api/analyzer               # Analyze resume (no auth required for demo)
POST   /api/analyzer/save          # Save analysis (auth required)
GET    /api/analyzer/history       # Get user's past analyses (auth required)
DELETE /api/analyzer/:id           # Delete an analysis (auth required)
```

### Health Check

```
GET    /api/health                 # Server health status
```

---

## 🔧 Technologies Explained

### Frontend Technologies

**React (UI Framework)**
- Component-based architecture for reusable UI
- Hooks for state management (useState, useEffect)
- React Router for navigation between pages
- Example: `AnalyzerWorkspace.jsx` manages resume input state

**Vite (Build Tool)**
- Lightning-fast development server with HMR
- Optimized production builds
- ~500ms startup time
- Handles CSS and image imports

**Tailwind CSS (Styling)**
- Utility-first CSS framework
- Pre-built responsive classes
- Consistent design system
- No custom CSS needed for most components
- Example: `className="min-h-screen bg-slate-950 px-6 py-12"`

**React Router (Routing)**
- Client-side page navigation
- Protected routes for authenticated users
- Example: `/dashboard` vs `/login` navigation

### Backend Technologies

**Express (Web Framework)**
- Minimal and flexible Node.js framework
- Middleware support (CORS, JSON parsing)
- Easy route organization
- Handles HTTP methods: GET, POST, PUT, DELETE

**MongoDB (NoSQL Database)**
- Document-based storage
- Schema-less flexibility
- Cloud hosting with MongoDB Atlas
- Collections: `users`, `analyses`

**Mongoose (ODM)**
- Schema validation for MongoDB
- Easy data modeling
- Pre/post hooks for data processing
- Example schemas in `models/User.js`, `models/Analysis.js`

**JWT Authentication**
- Stateless authentication tokens
- Secure token signing with `JWT_SECRET`
- Token includes userId
- Verified in `authMiddleware.js`

### AI Technologies

**OpenAI API**
- GPT-4 model for advanced reasoning
- Detailed resume analysis
- Cost: ~$0.30 per analysis (depends on usage)

**Groq SDK**
- Fast inference for LLMs
- Lower cost alternative
- Model: `openai/gpt-oss-20b`
- Server auto-switches based on API key set

**PDF Parse**
- Extracts text from PDF files
- Handles various PDF formats
- Buffer-based processing (no file system needed)

---

## 📌 Notes

- **First request may be slow** - Due to Render free tier cold starts on first request
- **Demo mode** - Does not require login or save data
- **API Keys** - Both OpenAI and Groq keys are optional; use whichever you have
- **MongoDB** - Free tier available at MongoDB Atlas (up to 512MB)
- **Deployment** - Frontend on Vercel, Backend on Render (both have free tiers)

---

## 📸 Screenshots

### 🚀 Landing Experience
<p align="center">
  <img src="docs/screenshots/1_landing1.png" width="45%"/>
  <img src="docs/screenshots/2_landing2.png" width="45%"/>
</p>

<p align="center">
  <img src="docs/screenshots/3_landing3.png" width="60%"/>
</p>

### 🧠 Resume Analyzer
<p align="center">
  <img src="docs/screenshots/4_analyzer.png" width="70%"/>
</p>

### 📊 Results & Insights
<p align="center">
  <img src="docs/screenshots/5_result.png" width="70%"/>
</p>

### 📌 Detailed Feedback
<p align="center">
  <img src="docs/screenshots/6_details1.png" width="45%"/>
  <img src="docs/screenshots/7_details2.png" width="45%"/>
</p>

---

## 👨‍💻 Author

Mahir Alam  
University of Calgary

---

⭐ **Star the repo if you found it useful!**
