"use strict";
/**
 * Type definitions for Cursor Composer Automation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationEvent = exports.AutomationStatus = exports.LogLevel = exports.DeploymentTarget = exports.ApplicationType = void 0;
// Application types
var ApplicationType;
(function (ApplicationType) {
    ApplicationType["WEB_APP"] = "web_app";
    ApplicationType["MOBILE_APP"] = "mobile_app";
    ApplicationType["DESKTOP_APP"] = "desktop_app";
    ApplicationType["API"] = "api";
    ApplicationType["CLI_TOOL"] = "cli_tool";
    ApplicationType["LIBRARY"] = "library";
    ApplicationType["OTHER"] = "other";
})(ApplicationType || (exports.ApplicationType = ApplicationType = {}));
// Deployment targets
var DeploymentTarget;
(function (DeploymentTarget) {
    DeploymentTarget["VERCEL"] = "vercel";
    DeploymentTarget["NETLIFY"] = "netlify";
    DeploymentTarget["AWS"] = "aws";
    DeploymentTarget["AZURE"] = "azure";
    DeploymentTarget["GCP"] = "gcp";
    DeploymentTarget["HEROKU"] = "heroku";
    DeploymentTarget["DIGITAL_OCEAN"] = "digital_ocean";
    DeploymentTarget["GITHUB_PAGES"] = "github_pages";
    DeploymentTarget["CUSTOM"] = "custom";
})(DeploymentTarget || (exports.DeploymentTarget = DeploymentTarget = {}));
// Log levels
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
// Status of automation process
var AutomationStatus;
(function (AutomationStatus) {
    AutomationStatus["IDLE"] = "idle";
    AutomationStatus["INITIALIZING"] = "initializing";
    AutomationStatus["PROCESSING_IDEA"] = "processing_idea";
    AutomationStatus["LAUNCHING_CURSOR"] = "launching_cursor";
    AutomationStatus["INTERACTING_WITH_COMPOSER"] = "interacting_with_composer";
    AutomationStatus["MONITORING_PROGRESS"] = "monitoring_progress";
    AutomationStatus["TESTING"] = "testing";
    AutomationStatus["DEPLOYING"] = "deploying";
    AutomationStatus["COMPLETED"] = "completed";
    AutomationStatus["FAILED"] = "failed";
})(AutomationStatus || (exports.AutomationStatus = AutomationStatus = {}));
// Events emitted during automation
var AutomationEvent;
(function (AutomationEvent) {
    AutomationEvent["STATUS_CHANGED"] = "status_changed";
    AutomationEvent["PROGRESS_UPDATE"] = "progress_update";
    AutomationEvent["ERROR"] = "error";
    AutomationEvent["COMPLETED"] = "completed";
})(AutomationEvent || (exports.AutomationEvent = AutomationEvent = {}));
