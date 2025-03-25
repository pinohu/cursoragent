"use strict";
/**
 * Service Entry Point for Cursor Composer Automation
 *
 * This module provides the service/daemon interface for the automation tool
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationService = void 0;
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const orchestrator_1 = require("./core/orchestrator");
const types_1 = require("./core/types");
class AutomationService {
    constructor(config, logger) {
        this.activeJobs = new Map();
        this.config = config;
        this.logger = logger;
        this.orchestrator = new orchestrator_1.Orchestrator(config, logger);
        this.app = (0, express_1.default)();
        // Configure Express
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        // Set up routes
        this.setupRoutes();
        this.setupEventHandlers();
    }
    /**
     * Start the service
     * @returns Promise resolving when service is started
     */
    async start() {
        return new Promise((resolve) => {
            const port = this.config.port || 3000;
            this.app.listen(port, () => {
                this.logger.info(`Automation service started on port ${port}`);
                resolve();
            });
        });
    }
    /**
     * Stop the service
     * @returns Promise resolving when service is stopped
     */
    async stop() {
        // Cleanup logic would go here
        this.logger.info('Automation service stopped');
    }
    /**
     * Set up service routes
     */
    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });
        // Process idea endpoint
        this.app.post('/process', async (req, res) => {
            try {
                const idea = req.body.idea;
                if (!idea) {
                    return res.status(400).json({ error: 'Idea input is required' });
                }
                // Generate job ID
                const jobId = this.generateJobId();
                // Initialize job status
                this.activeJobs.set(jobId, { status: types_1.AutomationStatus.INITIALIZING, progress: 0 });
                // Start processing in background
                this.processIdea(jobId, idea);
                // Return job ID
                res.status(202).json({ jobId });
            }
            catch (error) {
                this.logger.error(`Error processing idea: ${error}`);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        // Get job status endpoint
        this.app.get('/status/:jobId', (req, res) => {
            const jobId = req.params.jobId;
            const jobStatus = this.activeJobs.get(jobId);
            if (!jobStatus) {
                return res.status(404).json({ error: 'Job not found' });
            }
            res.status(200).json(jobStatus);
        });
        // List all jobs endpoint
        this.app.get('/jobs', (req, res) => {
            const jobs = {};
            for (const [jobId, status] of this.activeJobs.entries()) {
                jobs[jobId] = status;
            }
            res.status(200).json(jobs);
        });
        // Cancel job endpoint
        this.app.post('/cancel/:jobId', (req, res) => {
            const jobId = req.params.jobId;
            const jobStatus = this.activeJobs.get(jobId);
            if (!jobStatus) {
                return res.status(404).json({ error: 'Job not found' });
            }
            // TODO: Implement job cancellation logic
            res.status(200).json({ message: 'Job cancellation requested' });
        });
    }
    /**
     * Process idea in background
     * @param jobId Job ID
     * @param idea Idea input
     */
    async processIdea(jobId, idea) {
        try {
            // Set up event listeners
            this.orchestrator.on('status_changed', (status) => {
                const currentJob = this.activeJobs.get(jobId);
                if (currentJob) {
                    this.activeJobs.set(jobId, { ...currentJob, status });
                }
            });
            this.orchestrator.on('progress_update', (update) => {
                const currentJob = this.activeJobs.get(jobId);
                if (currentJob) {
                    this.activeJobs.set(jobId, { ...currentJob, progress: update.progress });
                }
            });
            // Start automation process
            const result = await this.orchestrator.processIdea(idea);
            // Update job status with final result
            this.activeJobs.set(jobId, {
                status: result.status,
                progress: result.status === types_1.AutomationStatus.COMPLETED ? 100 : 0
            });
            // Clean up job after some time
            setTimeout(() => {
                this.activeJobs.delete(jobId);
            }, 3600000); // Remove after 1 hour
        }
        catch (error) {
            this.logger.error(`Error processing job ${jobId}: ${error}`);
            // Update job status with error
            this.activeJobs.set(jobId, {
                status: types_1.AutomationStatus.FAILED,
                progress: 0
            });
        }
    }
    /**
     * Generate unique job ID
     * @returns Unique job ID
     */
    generateJobId() {
        return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    setupEventHandlers() {
        this.orchestrator.on('status_changed', (status) => {
            this.logger.info(`Status changed: ${status}`);
        });
        this.orchestrator.on('progress_update', (update) => {
            this.logger.info(`Progress: ${update.progress}% - ${update.message}`);
        });
        this.orchestrator.on('error', (error) => {
            this.logger.error('Error:', error);
        });
    }
}
exports.AutomationService = AutomationService;
