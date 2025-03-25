# Cursor Composer Automation

A comprehensive solution for automating the process of taking an idea through Cursor Composer to a final deployed application without human intervention.

## Overview

This project provides both a command-line tool and a service/daemon that automates the entire workflow from idea input to application deployment using Cursor Composer. The automation handles:

1. Processing idea input from various formats
2. Controlling Cursor and its Composer Agent mode
3. Monitoring file system changes during development
4. Testing generated applications
5. Deploying to multiple target platforms

## Features

- **Idea Input Processing**: Parse and process idea descriptions from JSON or YAML files
- **Cursor Composer Control**: Automate interactions with Cursor's Composer Agent mode
- **File System Monitoring**: Track and organize files created during the development process
- **Deployment Automation**: Deploy applications to multiple platforms (Vercel, Netlify, AWS, etc.)
- **Error Handling & Recovery**: Robust error handling with automatic recovery mechanisms
- **Logging & Monitoring**: Comprehensive logging and progress tracking
- **CLI & Service Modes**: Use as a command-line tool or run as a background service

## Installation

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher
- Cursor Editor installed on your system

### Install from npm

```bash
npm install -g cursor-composer-automation
```

### Install from source

```bash
git clone https://github.com/yourusername/cursor-composer-automation.git
cd cursor-composer-automation
npm install
npm run build
npm link
```

## Usage

### Command Line Interface

#### Process an idea and generate an application

```bash
cursor-composer-automation process --idea path/to/idea.json --output path/to/output
```

#### Deploy the generated application

```bash
cursor-composer-automation process --idea path/to/idea.json --output path/to/output --deploy --targets vercel,netlify
```

#### Start the automation service

```bash
cursor-composer-automation service --config path/to/config.json --port 3000
```

### API Usage

```typescript
import { Orchestrator, IdeaInput, Configuration } from 'cursor-composer-automation';

// Create configuration
const config: Configuration = {
  cursorPath: '/Applications/Cursor.app/Contents/MacOS/Cursor',
  workingDirectory: './output',
  deploymentSettings: {
    targets: ['vercel', 'netlify'],
    credentials: {
      // Your deployment credentials
    },
    options: {
      // Deployment options
    }
  },
  logLevel: 'info',
  serviceMode: false
};

// Create idea input
const idea: IdeaInput = {
  title: 'Task Management App',
  description: 'Create a simple task management application...',
  type: 'web_app',
  features: [
    'User authentication',
    'Create new tasks',
    // ...
  ],
  frameworks: [
    'React',
    'Node.js',
    // ...
  ],
  deploymentTarget: [
    'vercel'
  ],
  additionalContext: 'The application should have a clean, minimalist design...'
};

// Create orchestrator
const orchestrator = new Orchestrator(config);

// Set up event listeners
orchestrator.on('status_changed', (status) => {
  console.log(`Status changed: ${status}`);
});

orchestrator.on('progress_update', (update) => {
  console.log(`Progress: ${update.percentage}% - ${update.message}`);
});

// Start automation process
orchestrator.start(idea)
  .then(result => {
    console.log('Automation completed successfully');
    console.log('Deployment URLs:', result.deploymentUrls);
  })
  .catch(error => {
    console.error('Automation failed:', error);
  });
```

## Configuration

### Configuration File

```json
{
  "cursorPath": "/Applications/Cursor.app/Contents/MacOS/Cursor",
  "workingDirectory": "./output",
  "deploymentSettings": {
    "targets": ["vercel", "netlify"],
    "credentials": {
      "vercel": {
        "token": "your-vercel-token"
      },
      "netlify": {
        "token": "your-netlify-token"
      }
    },
    "options": {
      "vercel": {
        "scope": "your-team-scope"
      }
    }
  },
  "logLevel": "info",
  "serviceMode": false,
  "port": 3000
}
```

### Idea Input Format

```json
{
  "title": "Task Management App",
  "description": "Create a simple task management application that allows users to create, view, edit, and delete tasks. The application should have a clean, modern interface and be responsive for both desktop and mobile devices.",
  "type": "web_app",
  "features": [
    "User authentication (sign up, login, logout)",
    "Create new tasks with title, description, due date, and priority",
    "View all tasks in a list with sorting and filtering options",
    "Edit existing tasks",
    "Delete tasks",
    "Mark tasks as complete",
    "Responsive design for mobile and desktop"
  ],
  "frameworks": [
    "React",
    "Node.js",
    "Express",
    "MongoDB"
  ],
  "deploymentTarget": [
    "vercel"
  ],
  "additionalContext": "The application should have a clean, minimalist design with a focus on usability. The color scheme should be professional but not boring, perhaps using a primary color of blue or green. The application should be intuitive to use without requiring a tutorial or extensive documentation."
}
```

## Service API

When running in service mode, the following REST API endpoints are available:

### Process Idea

```
POST /process
Content-Type: application/json

{
  "idea": {
    "title": "Task Management App",
    "description": "Create a simple task management application...",
    ...
  }
}
```

Response:

```json
{
  "jobId": "job_1234567890"
}
```

### Get Job Status

```
GET /status/:jobId
```

Response:

```json
{
  "status": "completed",
  "progress": 100
}
```

### List All Jobs

```
GET /jobs
```

Response:

```json
{
  "job_1234567890": {
    "status": "completed",
    "progress": 100
  },
  "job_0987654321": {
    "status": "processing_idea",
    "progress": 10
  }
}
```

### Cancel Job

```
POST /cancel/:jobId
```

Response:

```json
{
  "message": "Job cancellation requested"
}
```

## Supported Deployment Targets

- Vercel
- Netlify
- AWS
- Azure
- Google Cloud Platform
- Heroku
- Digital Ocean
- GitHub Pages
- Custom (configurable)

## Error Handling

The automation system includes robust error handling with automatic recovery for common issues:

- Network connectivity problems
- Cursor application crashes
- Deployment service outages
- File system access issues

Detailed error logs are available in the `error.log` file.

## License

MIT
