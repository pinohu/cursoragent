/**
 * Cursor Controller for Cursor Composer Automation
 *
 * This module manages the Cursor application and interactions with Composer
 */
import * as winston from 'winston';
import { AutomationStatus } from './core/types';
export declare class CursorController {
    private logger;
    private cursorPath;
    private workingDirectory;
    private cursorProcess;
    private isRunning;
    private status;
    constructor(logger: winston.Logger, cursorPath: string, workingDirectory: string);
    /**
     * Launch Cursor application
     * @returns Promise resolving when Cursor is launched
     */
    launchCursor(): Promise<void>;
    /**
     * Close Cursor application
     * @returns Promise resolving when Cursor is closed
     */
    closeCursor(): Promise<void>;
    /**
     * Activate Composer in Agent mode
     * @returns Promise resolving when Composer is activated
     */
    activateComposer(): Promise<void>;
    /**
     * Input prompt to Composer
     * @param prompt The prompt to input
     * @returns Promise resolving when prompt is input
     */
    inputPrompt(prompt: string): Promise<void>;
    /**
     * Check if Cursor Composer has completed its task
     * @returns Promise resolving to completion status
     */
    checkCompletion(): Promise<boolean>;
    /**
     * Wait for Cursor to start
     * @returns Promise resolving when Cursor has started
     */
    private waitForCursorToStart;
    /**
     * Wait for Composer to be activated
     * @returns Promise resolving when Composer is activated
     */
    private waitForComposerActivation;
    /**
     * Wait for prompt to be processed
     * @returns Promise resolving when prompt is processed
     */
    private waitForPromptProcessing;
    /**
     * Install cursor-tools CLI
     * @returns Promise resolving when cursor-tools is installed
     */
    installCursorTools(): Promise<void>;
    /**
     * Configure cursor-tools
     * @returns Promise resolving when cursor-tools is configured
     */
    configureCursorTools(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    getStatus(): AutomationStatus;
}
