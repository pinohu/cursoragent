/**
 * Service Entry Point for Cursor Composer Automation
 *
 * This module provides the service/daemon interface for the automation tool
 */
import * as winston from 'winston';
import { Configuration } from './core/types';
export declare class AutomationService {
    private app;
    private orchestrator;
    private logger;
    private config;
    private activeJobs;
    constructor(config: Configuration, logger: winston.Logger);
    /**
     * Start the service
     * @returns Promise resolving when service is started
     */
    start(): Promise<void>;
    /**
     * Stop the service
     * @returns Promise resolving when service is stopped
     */
    stop(): Promise<void>;
    /**
     * Set up service routes
     */
    private setupRoutes;
    /**
     * Process idea in background
     * @param jobId Job ID
     * @param idea Idea input
     */
    private processIdea;
    /**
     * Generate unique job ID
     * @returns Unique job ID
     */
    private generateJobId;
    private setupEventHandlers;
}
