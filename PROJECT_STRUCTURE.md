# Career Roadmap Tool - Project Structure & Localhost Setup

## 📁 Project Overview

This is a **responsive, multi-tab Career Roadmap Tool** built with React frontend and Node.js backend. The application helps users create personalized career roadmaps based on their current role, target role, and skills.

## 🏗️ Project Architecture

```
crt11/
├── 📁 client/                 # React Frontend
├── 📁 server/                 # Node.js Backend
├── 📁 api/                    # Vercel Serverless Functions
├── 📄 package.json            # Root package configuration
├── 📄 vercel.json             # Vercel deployment config
└── 📄 README.md               # Project documentation
```

## 🚀 Localhost Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API Key

### Installation & Setup

1. **Clone and Install Dependencies**
```bash
# Install root dependencies
npm install

# Install all dependencies (server + client)
npm run install-all
```

2. **Environment Setup**
```bash
# Create server/.env file
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
NODE_ENV=development

# Create client/.env.local file (optional)
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Start Development Servers**
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
npm run server    # Backend on http://localhost:5000
npm run client    # Frontend on http://localhost:3000
```

## 📂 Detailed Project Structure

### 🎨 Frontend (React) - `/client/`

```
client/
├── 📁 src/
│   ├── 📁 components/         # React Components
│   │   ├── 📄 LandingPage.js      # 3-step intake wizard
│   │   ├── 📄 ResultsPage.js      # Main results interface
│   │   ├── 📄 Navbar.js           # Navigation bar
│   │   ├── 📄 LLMLearningAssistant.js  # AI chatbot
│   │   └── 📁 tabs/               # Tab components
│   │       ├── 📄 SkillGapsTab.js     # Skills analysis
│   │       ├── 📄 CareerPathTab.js     # Career roadmap
│   │       ├── 📄 InterviewPrepTab.js  # Company interviews
│   │       └── 📄 ProjectsTab.js       # Project recommendations
│   ├── 📁 context/
│   │   └── 📄 CareerPathContext.js    # State management
│   ├── 📄 App.js               # Main App component
│   ├── 📄 index.js             # React entry point
│   └── 📄 index.css             # Global styles
├── 📁 public/                  # Static assets
├── 📄 package.json             # Frontend dependencies
└── 📄 tailwind.config.js       # Tailwind CSS config
```

**Key Frontend Technologies:**
- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - HTTP client

### 🔧 Backend (Node.js) - `/server/`

```
server/
├── 📄 index.js                 # Main server file
├── 📄 careerTopics.json        # Career path data
├── 📄 package.json             # Backend dependencies
└── 📁 node_modules/            # Dependencies
```

**Key Backend Technologies:**
- **Express.js** - Web framework
- **CORS** - Cross-origin requests
- **OpenAI API** - AI integration
- **Nodemon** - Development server

### 🌐 API Endpoints (Localhost)

The backend server runs on `http://localhost:5000` and provides these endpoints:

#### 📊 Data Endpoints
- `GET /api/current-roles` - Available current roles
- `GET /api/target-roles` - Available target roles
- `GET /api/suggested-skills/:targetRole` - Skills for target role
- `GET /api/companies` - Company interview data
- `GET /api/projects/:targetRole` - Projects for target role
- `GET /api/career-topics/:targetRole` - Career path topics

#### 🤖 AI Endpoints
- `POST /api/analyze-skills` - Analyze user skills and generate roadmap
- `POST /api/skill-info/:skill` - Get detailed skill information
- `POST /api/llm-assistance` - AI learning assistant

## 🔄 Application Flow

### 1. **Landing Page (3-Step Wizard)**
```
Step 1: Current Role Selection
├── Software Engineer
├── Data Scientist
├── DevOps Engineer
└── Other (custom input)

Step 2: Target Role Selection
├── Software Engineering
├── Data Science
├── Data Analytics
├── DevOps & Cloud Computing
└── Advanced AI & ML

Step 3: Current Skills Selection
├── High Priority Skills (9 skills)
├── Medium Priority Skills (8 skills)
└── Low Priority Skills (13 skills)
```

### 2. **Results Page (4 Tabs)**

#### 🎯 **Skill Gaps Tab**
- **Career Match Score** - Percentage based on skill coverage
- **Your Current Skills** - Skills user already has
- **Skills to Learn** - Missing skills grouped by priority:
  - High Priority (9 skills)
  - Medium Priority (8 skills) 
  - Low Priority (13 skills)
- **Skill Details Modal** - Click any skill for detailed information

#### 🛤️ **Career Path Tab**
- **11-Step Roadmap** for Software Engineering
- **7-Step Roadmap** for DevOps & Cloud Computing
- **Step Details Modal** with:
  - Why to learn
  - What to learn (topics list)
  - Milestone
  - AI Learning Assistant

#### 💼 **Interview Prep Tab**
- **Company Cards** with interview details:
  - Microsoft, Accenture, Cisco, Oracle
  - Interview stages and rounds
  - Common questions
  - Salary ranges
- **Company Details Modal** with full interview experience

#### 🚀 **Projects Tab**
- **Role-Specific Projects** based on target role
- **Project Tiers**: Beginner, Intermediate, Advanced
- **Project Details Modal** with:
  - Step-by-step instructions
  - Code examples
  - Skills covered
  - Career questions section

## 🧠 AI Integration

### OpenAI API Features
- **Skill Analysis** - Intelligent skill gap analysis
- **Learning Assistant** - Real-time AI tutoring
- **Career Guidance** - Personalized recommendations
- **Interview Prep** - Company-specific question generation

### AI Endpoints
```javascript
// Skill Analysis
POST /api/analyze-skills
{
  "currentRole": "Software Engineer",
  "targetRole": "Software Engineering", 
  "currentSkills": ["JavaScript", "React", "Node.js"],
  "experience": "2-3 years"
}

// AI Learning Assistant
POST /api/llm-assistance
{
  "skill": "React",
  "userQuestion": "How do I learn React hooks?",
  "targetRole": "Software Engineering"
}
```

## 📊 Data Structure

### Skills Taxonomy
```javascript
const skillTaxonomy = {
  'Software Engineering': {
    'Programming Languages': ['JavaScript', 'Python', 'Java', 'C++'],
    'Computer Science Fundamentals': ['Data structures', 'Algorithms'],
    'System Design': ['Microservices', 'Caching', 'Load balancing'],
    // ... more categories
  }
}
```

### Priority Mapping
```javascript
const explicitPriorities = {
  'Software Engineering': {
    'Programming Languages (C++, C, Java, Python)': 'High',
    'Data structures': 'High',
    'Algorithms': 'High',
    'Containerization (Docker)': 'Low',
    // ... more skills
  }
}
```

## 🎨 UI/UX Features

### Design System
- **Tailwind CSS** - Utility-first styling
- **Custom Color Palette** - Primary, success, danger colors
- **Responsive Design** - Mobile-first approach
- **Animations** - Framer Motion for smooth transitions

### Key Components
- **Multi-step Form** - 3-step intake wizard
- **Tabbed Interface** - 4 main result tabs
- **Modal System** - Side modals for detailed views
- **Progress Indicators** - Visual progress tracking
- **Interactive Elements** - Hover effects, animations

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run server          # Start backend only (port 5000)
npm run client          # Start frontend only (port 3000)

# Production
npm run build           # Build frontend for production
npm run install-all     # Install all dependencies

# Individual
cd server && npm run dev    # Backend development
cd client && npm start      # Frontend development
```

## 🌐 Deployment

### Localhost Development
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Base**: http://localhost:5000/api

### Vercel Deployment
- **Frontend**: Deployed as static site
- **Backend**: Serverless functions in `/api/` directory
- **Environment**: Production environment variables

## 📝 Key Features

### ✅ **Implemented Features**
- 3-step intake wizard
- 4-tab results interface
- AI-powered skill analysis
- Career path roadmap
- Company interview prep
- Project recommendations
- Real-time AI assistance
- Responsive design
- Local storage persistence

### 🎯 **Core Functionality**
- **Skill Gap Analysis** - Intelligent skill assessment
- **Career Roadmapping** - Step-by-step career paths
- **Interview Preparation** - Company-specific guidance
- **Project Recommendations** - Role-aligned projects
- **AI Learning Assistant** - Real-time tutoring

## 🔍 Troubleshooting

### Common Issues
1. **Port Conflicts** - Ensure ports 3000 and 5000 are available
2. **API Key Missing** - Set OPENAI_API_KEY in server/.env
3. **CORS Issues** - Backend includes CORS middleware
4. **Build Errors** - Run `npm run install-all` to install all dependencies

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check API endpoints
curl http://localhost:5000/api/current-roles
curl http://localhost:5000/api/target-roles
```

## 📈 Performance

### Optimization Features
- **React.memo** - Component memoization
- **useCallback** - Function memoization
- **useMemo** - Value memoization
- **Code Splitting** - Lazy loading
- **Image Optimization** - Optimized assets

### Bundle Analysis
- **Frontend**: ~2MB (production build)
- **Backend**: ~50MB (with dependencies)
- **API Response**: <100KB per request

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <repository>
cd crt11
npm run install-all

# 2. Set up environment
# Add OPENAI_API_KEY to server/.env

# 3. Start development
npm run dev

# 4. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

This project provides a comprehensive career roadmap tool with AI integration, helping users navigate their career development journey with personalized insights and recommendations.
