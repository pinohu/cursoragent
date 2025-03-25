# API Reference

This document provides detailed information about the API for the Cursor Composer Automation solution.

## Core Types

### IdeaInput

```typescript
interface IdeaInput {
  title: string;
  description: string;
  type: ApplicationType;
  features: string[];
  frameworks: string[];
  deploymentTarget: DeploymentTarget[];
  additionalContext?: string;
}
```

### Configuration

```typescript
interface Configuration {
  cursorPath: string;
  workingDirectory: string;
  deploymentSettings: DeploymentSettings;
  logLevel: LogLevel;
  serviceMode: boolean;
  port?: number;
}
```

### DeploymentSettings

```typescript
interface DeploymentSettings {
  targets: DeploymentTarget[];
  credentials: Record<string, any>;
  options: Record<string, any>;
}
```

### AutomationStatus

```typescript
enum AutomationStatus {
  IDLE = 'idle',
  INITIALIZING = 'initializing',
  PROCESSING_IDEA = 'processing_idea',
  LAUNCHING_CURSOR = 'launching_cursor',
  INTERACTING_WITH_COMPOSER = 'interacting_with_composer',
  MONITORING_PROGRESS = 'monitoring_progress',
  TESTING = 'testing',
  DEPLOYING = 'deploying',
  COMPLETED = 'completed',
  FAILED = 'failed'
}
```

### ApplicationType

```typescript
enum ApplicationType {
  WEB_APP = 'web_app',
  API = 'api',
  CLI_TOOL = 'cli_tool',
  DESKTOP_APP = 'desktop_app',
  MOBILE_APP = 'mobile_app',
  LIBRARY = 'library'
}
```

### DeploymentTarget

```typescript
enum DeploymentTarget {
  VERCEL = 'vercel',
  NETLIFY = 'netlify',
  AWS = 'aws',
  AZURE = 'azure',
  GCP = 'gcp',
  HEROKU = 'heroku',
  DIGITAL_OCEAN = 'digital_ocean',
  GITHUB_PAGES = 'github_pages',
  CUSTOM = 'custom'
}
```

### LogLevel

```typescript
enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}
```

## Core Classes

### Orchestrator

The main class that coordinates the automation process.

```typescript
class Orchestrator extends EventEmitter {
  constructor(config: Configuration);
  
  // Start the automation process
  async start(idea: IdeaInput): Promise<AutomationResult>;
  
  // Start the service mode
  async startService(): Promise<void>;
  
  // Stop the service mode
  async stopService(): Promise<void>;
  
  // Events
  on(event: 'status_changed', listener: (status: AutomationStatus) => void): this;
  on(event: 'progress_update', listener: (update: ProgressUpdate) => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
}
```

### IdeaParser

Parses and validates idea input.

```typescript
class IdeaParser {
  constructor(logger: winston.Logger);
  
  // Parse and validate idea input
  parse(input: any): IdeaInput;
  
  // Generate prompt for Cursor Composer
  generatePrompt(idea: IdeaInput): string;
}
```

### CursorController

Controls the Cursor application and Composer.

```typescript
class CursorController extends EventEmitter {
  constructor(logger: winston.Logger, cursorPath: string, workingDirectory: string);
  
  // Launch Cursor application
  async launchCursor(): Promise<void>;
  
  // Close Cursor application
  async closeCursor(): Promise<void>;
  
  // Activate Composer in Agent mode
  async activateComposer(): Promise<void>;
  
  // Input prompt to Composer
  async inputPrompt(prompt: string): Promise<void>;
  
  // Check if Composer has completed
  async checkCompletion(): Promise<boolean>;
  
  // Install cursor-tools CLI
  async installCursorTools(): Promise<void>;
  
  // Configure cursor-tools
  async configureCursorTools(): Promise<void>;
}
```

### FileSystemManager

Manages file system operations and monitoring.

```typescript
class FileSystemManager extends EventEmitter {
  constructor(logger: winston.Logger, workingDirectory: string);
  
  // Start monitoring file system changes
  async startMonitoring(): Promise<void>;
  
  // Stop monitoring file system changes
  async stopMonitoring(): Promise<void>;
  
  // Get all files created during monitoring
  getCreatedFiles(): string[];
  
  // Get all files modified during monitoring
  getModifiedFiles(): string[];
  
  // Organize project structure
  async organizeProject(projectName: string): Promise<string>;
  
  // Check if a specific file exists
  fileExists(filePath: string): boolean;
  
  // Read file content
  readFile(filePath: string): string;
  
  // Write content to file
  writeFile(filePath: string, content: string): void;
  
  // Events
  on(event: 'file-created', listener: (filePath: string) => void): this;
  on(event: 'file-modified', listener: (filePath: string) => void): this;
  on(event: 'file-deleted', listener: (filePath: string) => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
}
```

### DeploymentManager

Manages application deployment to various targets.

```typescript
class DeploymentManager {
  constructor(logger: winston.Logger, deploymentSettings: DeploymentSettings);
  
  // Deploy application to specified targets
  async deployApplication(projectDir: string): Promise<Record<string, string>>;
}
```

### AutomationService

Provides a REST API for the automation service.

```typescript
class AutomationService {
  constructor(config: Configuration, logger: winston.Logger);
  
  // Start the service
  async start(): Promise<void>;
  
  // Stop the service
  async stop(): Promise<void>;
}
```

## Events

### status_changed

Emitted when the automation status changes.

```typescript
orchestrator.on('status_changed', (status: AutomationStatus) => {
  console.log(`Status changed: ${status}`);
});
```

### progress_update

Emitted when there is a progress update.

```typescript
orchestrator.on('progress_update', (update: ProgressUpdate) => {
  console.log(`Progress: ${update.percentage}% - ${update.message}`);
});
```

### error

Emitted when an error occurs.

```typescript
orchestrator.on('error', (error: Error) => {
  console.error(`Error: ${error}`);
});
```

## Return Types

### AutomationResult

```typescript
interface AutomationResult {
  status: AutomationStatus;
  projectPath?: string;
  deploymentUrls?: Record<string, string>;
  logs?: string[];
  errors?: string[];
  duration?: number;
}
```

### ProgressUpdate

```typescript
interface ProgressUpdate {
  status: AutomationStatus;
  message: string;
  percentage: number;
  timestamp: number;
}
```
