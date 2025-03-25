"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationStatus = exports.LogLevel = exports.DeploymentTarget = exports.ApplicationType = void 0;
var ApplicationType;
(function (ApplicationType) {
    ApplicationType["WEB"] = "WEB";
    ApplicationType["MOBILE"] = "MOBILE";
    ApplicationType["DESKTOP"] = "DESKTOP";
    ApplicationType["CLI"] = "CLI";
    ApplicationType["API"] = "API";
})(ApplicationType || (exports.ApplicationType = ApplicationType = {}));
var DeploymentTarget;
(function (DeploymentTarget) {
    DeploymentTarget["VERCEL"] = "VERCEL";
    DeploymentTarget["NETLIFY"] = "NETLIFY";
    DeploymentTarget["HEROKU"] = "HEROKU";
    DeploymentTarget["AWS"] = "AWS";
    DeploymentTarget["GCP"] = "GCP";
    DeploymentTarget["AZURE"] = "AZURE";
    DeploymentTarget["DIGITAL_OCEAN"] = "DIGITAL_OCEAN";
    DeploymentTarget["GITHUB_PAGES"] = "GITHUB_PAGES";
    DeploymentTarget["CUSTOM"] = "CUSTOM";
})(DeploymentTarget || (exports.DeploymentTarget = DeploymentTarget = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
var AutomationStatus;
(function (AutomationStatus) {
    AutomationStatus["IDLE"] = "IDLE";
    AutomationStatus["INITIALIZING"] = "INITIALIZING";
    AutomationStatus["RUNNING"] = "RUNNING";
    AutomationStatus["COMPLETED"] = "COMPLETED";
    AutomationStatus["FAILED"] = "FAILED";
    AutomationStatus["CANCELLED"] = "CANCELLED";
})(AutomationStatus || (exports.AutomationStatus = AutomationStatus = {}));
