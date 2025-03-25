# Usage Examples

This document provides practical examples of using the Cursor Composer Automation solution for various scenarios.

## Command Line Examples

### Basic Usage: Process an Idea

```bash
cursor-composer-automation process --idea examples/task_app.json --output ./my_task_app
```

This command will:
1. Read the idea from `examples/task_app.json`
2. Launch Cursor and activate Composer
3. Generate the application in the `./my_task_app` directory

### Deploy to Vercel

```bash
cursor-composer-automation process --idea examples/portfolio_website.json --output ./portfolio --deploy --targets vercel
```

This command will:
1. Generate the portfolio website application
2. Deploy it to Vercel
3. Return the deployment URL

### Deploy to Multiple Platforms

```bash
cursor-composer-automation process --idea examples/weather_dashboard.json --output ./weather_app --deploy --targets vercel,netlify
```

This command will:
1. Generate the weather dashboard application
2. Deploy it to both Vercel and Netlify
3. Return the deployment URLs for both platforms

### Use a Custom Configuration

```bash
cursor-composer-automation process --idea examples/ecommerce_api.json --output ./ecommerce_api --config my-config.json
```

This command will use the settings in `my-config.json` for the automation process.

### Run in Verbose Mode

```bash
cursor-composer-automation process --idea examples/data_analysis_cli.json --output ./data_cli --verbose
```

This command will run with detailed logging for debugging purposes.

### Start the Service

```bash
cursor-composer-automation service --config service-config.json --port 3000
```

This command will start the automation service on port 3000 using the configuration in `service-config.json`.

## API Examples

### Basic Usage

```typescript
import { Orchestrator, IdeaInput, Configuration } from 'cursor-composer-automation';

// Create configuration
const config: Configuration = {
  cursorPath: '/Applications/Cursor.app/Contents/MacOS/Cursor',
  workingDirectory: './output',
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

// Start automation process
orchestrator.start(idea)
  .then(result => {
    console.log('Automation completed successfully');
    console.log('Project path:', result.projectPath);
  })
  .catch(error => {
    console.error('Automation failed:', error);
  });
```

### With Event Listeners

```typescript
import { Orchestrator, IdeaInput, Configuration, AutomationStatus } from 'cursor-composer-automation';

// Create configuration
const config: Configuration = {
  cursorPath: '/Applications/Cursor.app/Contents/MacOS/Cursor',
  workingDirectory: './output',
  logLevel: 'info',
  serviceMode: false
};

// Create idea input
const idea: IdeaInput = {
  // ... idea details ...
};

// Create orchestrator
const orchestrator = new Orchestrator(config);

// Set up event listeners
orchestrator.on('status_changed', (status: AutomationStatus) => {
  console.log(`Status changed: ${status}`);
});

orchestrator.on('progress_update', (update) => {
  console.log(`Progress: ${update.percentage}% - ${update.message}`);
  
  // Update UI progress bar
  updateProgressBar(update.percentage);
});

orchestrator.on('error', (error) => {
  console.error(`Error: ${error}`);
  
  // Show error notification
  showErrorNotification(error.message);
});

// Start automation process
orchestrator.start(idea)
  .then(result => {
    console.log('Automation completed successfully');
    
    if (result.deploymentUrls) {
      // Open deployment URLs in browser
      for (const [target, url] of Object.entries(result.deploymentUrls)) {
        console.log(`${target}: ${url}`);
        openBrowser(url);
      }
    }
  })
  .catch(error => {
    console.error('Automation failed:', error);
  });
```

### Deploy to Multiple Targets

```typescript
import { Orchestrator, IdeaInput, Configuration, DeploymentTarget } from 'cursor-composer-automation';

// Create configuration with multiple deployment targets
const config: Configuration = {
  cursorPath: '/Applications/Cursor.app/Contents/MacOS/Cursor',
  workingDirectory: './output',
  deploymentSettings: {
    targets: [
      DeploymentTarget.VERCEL,
      DeploymentTarget.NETLIFY,
      DeploymentTarget.AWS
    ],
    credentials: {
      vercel: {
        token: process.env.VERCEL_TOKEN
      },
      netlify: {
        token: process.env.NETLIFY_TOKEN
      },
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-west-2'
      }
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
  // ... idea details ...
};

// Create orchestrator
const orchestrator = new Orchestrator(config);

// Start automation process
orchestrator.start(idea)
  .then(result => {
    console.log('Automation completed successfully');
    
    if (result.deploymentUrls) {
      console.log('Deployment URLs:');
      for (const [target, url] of Object.entries(result.deploymentUrls)) {
        console.log(`${target}: ${url}`);
      }
    }
  })
  .catch(error => {
    console.error('Automation failed:', error);
  });
```

### Run as a Service

```typescript
import { AutomationService, Configuration } from 'cursor-composer-automation';
import * as winston from 'winston';

// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Create configuration
const config: Configuration = {
  cursorPath: '/Applications/Cursor.app/Contents/MacOS/Cursor',
  workingDirectory: './output',
  deploymentSettings: {
    targets: [],
    credentials: {},
    options: {}
  },
  logLevel: 'info',
  serviceMode: true,
  port: 3000
};

// Create service
const service = new AutomationService(config, logger);

// Start service
service.start()
  .then(() => {
    logger.info('Service started successfully on port 3000');
  })
  .catch(error => {
    logger.error('Failed to start service:', error);
    process.exit(1);
  });

// Handle termination signals
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down...');
  await service.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down...');
  await service.stop();
  process.exit(0);
});
```

## REST API Examples

### Process an Idea

```bash
curl -X POST http://localhost:3000/process \
  -H "Content-Type: application/json" \
  -d '{
    "idea": {
      "title": "Task Management App",
      "description": "Create a simple task management application...",
      "type": "web_app",
      "features": [
        "User authentication",
        "Create new tasks"
      ],
      "frameworks": [
        "React",
        "Node.js"
      ],
      "deploymentTarget": [
        "vercel"
      ],
      "additionalContext": "The application should have a clean, minimalist design..."
    }
  }'
```

Response:

```json
{
  "jobId": "job_1234567890"
}
```

### Get Job Status

```bash
curl -X GET http://localhost:3000/status/job_1234567890
```

Response:

```json
{
  "status": "processing_idea",
  "progress": 10
}
```

### List All Jobs

```bash
curl -X GET http://localhost:3000/jobs
```

Response:

```json
{
  "job_1234567890": {
    "status": "processing_idea",
    "progress": 10
  },
  "job_0987654321": {
    "status": "completed",
    "progress": 100
  }
}
```

### Cancel a Job

```bash
curl -X POST http://localhost:3000/cancel/job_1234567890
```

Response:

```json
{
  "message": "Job cancellation requested"
}
```
