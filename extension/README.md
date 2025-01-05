# Resume Optimizer Chrome Extension

This Chrome extension helps you analyze job postings and auto-fill job applications with your resume data.

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build:extension
   ```
4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Usage

1. Navigate to a job posting (supported sites: LinkedIn, Indeed, Workday, Greenhouse)
2. Click the extension icon in your Chrome toolbar
3. Click "Analyze Job" to analyze the posting
4. Use "Auto-fill" to populate the application form with your resume data

## Supported Job Sites

- LinkedIn
- Indeed
- Workday
- Greenhouse

## Features

- Job posting analysis
- Resume match scoring
- Automatic form filling
- Keyword optimization suggestions
- Skills gap analysis

## Development

To work on the extension:

1. Make changes to files in the `extension/` directory
2. Run `npm run build:extension` to rebuild
3. Click the refresh icon in `chrome://extensions/` to update the extension

## Troubleshooting

If the extension isn't working:

1. Check the console for errors (Right-click > Inspect > Console)
2. Make sure you're on a supported job site
3. Try refreshing the page
4. Reload the extension from `chrome://extensions/`