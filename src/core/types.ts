export enum ApplicationType {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
  CLI = 'CLI',
  API = 'API'
}

export enum DeploymentTarget {
  VERCEL = 'VERCEL',
  NETLIFY = 'NETLIFY',
  HEROKU = 'HEROKU',
  AWS = 'AWS',
  GCP = 'GCP',
  AZURE = 'AZURE',
  DIGITAL_OCEAN = 'DIGITAL_OCEAN',
  GITHUB_PAGES = 'GITHUB_PAGES',
  CUSTOM = 'CUSTOM'
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export enum AutomationStatus {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface DeploymentSettings {
  targets: DeploymentTarget[];
  credentials: Record<string, any>;
  options: Record<string, any>;
}

export interface IdeaInput {
  name: string;
  title: string;
  description: string;
  type: ApplicationType;
  features: string[];
  technologies: string[];
  dependencies: string[];
  frameworks?: string[];
  additionalContext?: string;
  deploymentTarget?: string[];
  deployment?: {
    targets: DeploymentTarget[];
    settings: Record<string, any>;
  };
}

export interface Configuration {
  cursorPath: string;
  workingDirectory: string;
  deploymentSettings: DeploymentSettings;
  logLevel: LogLevel;
  serviceMode: boolean;
  port?: number;
}

export interface AutomationResult {
  status: AutomationStatus;
  deploymentUrls?: Record<string, string>;
  errors?: string[];
} 