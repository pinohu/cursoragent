/**
 * Type definitions for Cursor Composer Automation
 */
export interface IdeaInput {
    title: string;
    description: string;
    type: ApplicationType;
    features: string[];
    deploymentTarget?: DeploymentTarget[];
    frameworks?: string[];
    additionalContext?: string;
}
export declare enum ApplicationType {
    WEB_APP = "web_app",
    MOBILE_APP = "mobile_app",
    DESKTOP_APP = "desktop_app",
    API = "api",
    CLI_TOOL = "cli_tool",
    LIBRARY = "library",
    OTHER = "other"
}
export declare enum DeploymentTarget {
    VERCEL = "vercel",
    NETLIFY = "netlify",
    AWS = "aws",
    AZURE = "azure",
    GCP = "gcp",
    HEROKU = "heroku",
    DIGITAL_OCEAN = "digital_ocean",
    GITHUB_PAGES = "github_pages",
    CUSTOM = "custom"
}
export interface Configuration {
    cursorPath: string;
    workingDirectory: string;
    deploymentSettings: DeploymentSettings;
    logLevel: LogLevel;
    serviceMode: boolean;
    port?: number;
}
export interface DeploymentSettings {
    targets: DeploymentTarget[];
    credentials: Record<string, string>;
    options: Record<string, any>;
}
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
export declare enum AutomationStatus {
    IDLE = "idle",
    INITIALIZING = "initializing",
    PROCESSING_IDEA = "processing_idea",
    LAUNCHING_CURSOR = "launching_cursor",
    INTERACTING_WITH_COMPOSER = "interacting_with_composer",
    MONITORING_PROGRESS = "monitoring_progress",
    TESTING = "testing",
    DEPLOYING = "deploying",
    COMPLETED = "completed",
    FAILED = "failed"
}
export interface AutomationResult {
    status: AutomationStatus;
    projectPath?: string;
    deploymentUrls?: string[];
    logs: string[];
    errors?: string[];
    duration: number;
}
export declare enum AutomationEvent {
    STATUS_CHANGED = "status_changed",
    PROGRESS_UPDATE = "progress_update",
    ERROR = "error",
    COMPLETED = "completed"
}
export interface ProgressUpdate {
    status: AutomationStatus;
    message: string;
    percentage: number;
    timestamp: number;
}
