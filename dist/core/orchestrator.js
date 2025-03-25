"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orchestrator = void 0;
const events_1 = require("events");
const types_1 = require("./types");
const cursor_controller_1 = require("../cursor-controller");
const deployment_manager_1 = require("../deployment-manager");
const idea_parser_1 = require("../idea-parser");
class Orchestrator extends events_1.EventEmitter {
    constructor(config, logger) {
        super();
        this.status = types_1.AutomationStatus.IDLE;
        this.config = config;
        this.logger = logger;
        this.cursorController = new cursor_controller_1.CursorController(logger, config.cursorPath, config.workingDirectory);
        this.deploymentManager = new deployment_manager_1.DeploymentManager(logger, config.deploymentSettings);
    }
    async startService() {
        this.status = types_1.AutomationStatus.INITIALIZING;
        this.emit('status_changed', this.status);
        await this.cursorController.start();
        this.status = types_1.AutomationStatus.IDLE;
        this.emit('status_changed', this.status);
    }
    async stopService() {
        this.status = types_1.AutomationStatus.CANCELLED;
        this.emit('status_changed', this.status);
        await this.cursorController.stop();
        this.status = types_1.AutomationStatus.IDLE;
        this.emit('status_changed', this.status);
    }
    async processIdea(idea) {
        var _a;
        try {
            this.status = types_1.AutomationStatus.RUNNING;
            this.emit('status_changed', this.status);
            // Validate and parse idea
            idea_parser_1.IdeaParser.validateIdea(idea);
            const parsedIdea = idea_parser_1.IdeaParser.parseIdea(idea);
            // Start Cursor
            await this.cursorController.start();
            this.emit('progress_update', { progress: 20, message: 'Cursor started' });
            // Process idea with Cursor
            // This is where we would integrate with Cursor's API
            this.emit('progress_update', { progress: 50, message: 'Processing idea with Cursor' });
            // Deploy if targets specified
            const deploymentUrls = {};
            if ((_a = parsedIdea.deployment) === null || _a === void 0 ? void 0 : _a.targets.length) {
                for (const target of parsedIdea.deployment.targets) {
                    const url = await this.deploymentManager.deploy(target);
                    deploymentUrls[target] = url;
                    this.emit('progress_update', {
                        progress: 50 + (50 * (parsedIdea.deployment.targets.indexOf(target) + 1) / parsedIdea.deployment.targets.length),
                        message: `Deployed to ${target}`
                    });
                }
            }
            // Stop Cursor
            await this.cursorController.stop();
            this.emit('progress_update', { progress: 100, message: 'Completed' });
            this.status = types_1.AutomationStatus.COMPLETED;
            this.emit('status_changed', this.status);
            return {
                status: types_1.AutomationStatus.COMPLETED,
                deploymentUrls
            };
        }
        catch (error) {
            this.status = types_1.AutomationStatus.FAILED;
            this.emit('status_changed', this.status);
            this.emit('error', error instanceof Error ? error : new Error(String(error)));
            return {
                status: types_1.AutomationStatus.FAILED,
                errors: [error instanceof Error ? error.message : String(error)]
            };
        }
    }
    getStatus() {
        return this.status;
    }
}
exports.Orchestrator = Orchestrator;
