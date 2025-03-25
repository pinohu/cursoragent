/**
 * Core orchestrator for Cursor Composer Automation
 *
 * This module coordinates the entire automation workflow from idea to deployment
 */
import { EventEmitter } from 'events';
import { IdeaInput, Configuration, AutomationResult } from './types';
export declare class Orchestrator extends EventEmitter {
    private status;
    private config;
    private logger;
    private startTime;
    private logs;
    private errors;
    constructor(config: Configuration);
    /**
     * Start the automation process with the given idea
     * @param idea The idea input to process
     * @returns Promise resolving to automation result
     */
    start(idea: IdeaInput): Promise<AutomationResult>;
    /**
     * Start the automation service
     * @returns Promise resolving when service is started
     */
    startService(): Promise<void>;
    /**
     * Stop the automation service
     * @returns Promise resolving when service is stopped
     */
    stopService(): Promise<void>;
    /**
     * Update the automation status and emit events
     * @param status New status
     * @param message Status message
     */
    private updateStatus;
    /**
     * Handle errors during automation
     * @param error The error that occurred
     */
    private handleError;
    /**
     * Calculate progress percentage based on current status
     * @param status Current automation status
     * @returns Progress percentage (0-100)
     */
    private calculateProgress;
    /**
     * Validate idea input
     * @param idea Idea input to validate
     * @throws Error if validation fails
     */
    private validateIdeaInput;
    /**
     * Get the current automation result
     * @returns Automation result
     */
    private getResult;
}
