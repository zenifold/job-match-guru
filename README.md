# ResumeAI - Smart Resume Management & Job Application Assistant

## Overview

ResumeAI is a comprehensive platform that helps job seekers optimize their resumes and streamline their job application process using AI-powered tools and analytics.

## Core Features

### Resume Management
- Create and manage multiple resume versions
- AI-powered resume optimization
- ATS-friendly formatting
- Professional templates
- Version control and history

### Job Application Tools
- Job posting analysis
- Skills gap identification
- Keyword optimization
- Match score calculation
- Application tracking

### Chrome Extension
Our Chrome extension enhances your job search by:
- Analyzing job postings in real-time
- Auto-filling job applications
- Providing instant resume match scoring
- Suggesting resume optimizations
- Automatic updates via Chrome Web Store

### AI Features
- Smart resume tailoring
- Skills gap analysis
- Job requirement matching
- Interview preparation suggestions
- Career growth recommendations

## Getting Started

### Web Application
1. Clone the repository
```bash
git clone <your-repo-url>
cd resumeai
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

### Chrome Extension Setup

1. Build the extension
```bash
npm run build:extension
```

2. Load in Chrome:
- Open Chrome and navigate to `chrome://extensions/`
- Enable "Developer mode" in the top right
- Click "Load unpacked"
- Select the `dist` folder from this project

3. Usage:
- Navigate to supported job sites (LinkedIn, Indeed, Workday, Greenhouse)
- Click the extension icon in your toolbar
- Use "Analyze Job" to analyze the posting
- Click "Auto-fill" to populate application forms

## Supported Job Sites
- LinkedIn
- Indeed
- Workday
- Greenhouse

## Troubleshooting the Extension

If you encounter issues:
1. Check the console for errors (Right-click > Inspect > Console)
2. Verify you're on a supported job site
3. Try refreshing the page
4. Reload the extension from `chrome://extensions/`
5. Ensure you're logged into the web application
6. Check that automatic updates are enabled in Chrome

## Development

### Prerequisites
- Node.js & npm installed
- Modern web browser (Chrome recommended)
- Basic understanding of React and TypeScript

### Tech Stack
- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS
- Supabase (Backend)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.