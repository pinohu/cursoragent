/**
 * Type definitions for Cursor Composer Automation
 */

// Idea input format
export interface IdeaInput {
  title: string;
  description: string;
  type: ApplicationType;
  features: string[];
  deploymentTarget?: DeploymentTarget[];
  frameworks?: string[];
  additionalContext?: string;
}

// Application types
export enum ApplicationType {
  WEB_APP = 'web_app',
  MOBILE_APP = 'mobile_app',
  DESKTOP_APP = 'desktop_app',
  API = 'api',
  CLI_TOOL = 'cli_tool',
  LIBRARY = 'library',
  OTHER = 'other'
}

// Deployment targets
export enum DeploymentTarget {
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

// Configuration options
export interface Configuration {
  cursorPath: string;
  workingDirectory: string;
  deploymentSettings: DeploymentSettings;
  logLevel: LogLevel;
  serviceMode: boolean;
  port?: number;
}

// Deployment settings
export interface DeploymentSettings {
  targets: DeploymentTarget[];
  credentials: Record<string, string>;
  options: Record<string, any>;
}

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// Status of automation process
export enum AutomationStatus {
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

// Result of automation process
export interface AutomationResult {
  status: AutomationStatus;
  projectPath?: string;
  deploymentUrls?: string[];
  logs: string[];
  errors?: string[];
  duration: number;
}

// Events emitted during automation
export enum AutomationEvent {
  STATUS_CHANGED = 'status_changed',
  PROGRESS_UPDATE = 'progress_update',
  ERROR = 'error',
  COMPLETED = 'completed'
}

// Progress update
export interface ProgressUpdate {
  status: AutomationStatus;
  message: string;
  percentage: number;
  timestamp: number;
}
