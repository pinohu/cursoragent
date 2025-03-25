/**
 * File System Manager for Cursor Composer Automation
 *
 * This module tracks and organizes files created by Cursor Composer
 */
import * as winston from 'winston';
import { EventEmitter } from 'events';
export declare class FileSystemManager extends EventEmitter {
    private logger;
    private workingDirectory;
    private watcher;
    private createdFiles;
    private modifiedFiles;
    constructor(logger: winston.Logger, workingDirectory: string);
    /**
     * Start monitoring file system changes
     * @returns Promise resolving when monitoring is started
     */
    startMonitoring(): Promise<void>;
    /**
     * Stop monitoring file system changes
     * @returns Promise resolving when monitoring is stopped
     */
    stopMonitoring(): Promise<void>;
    /**
     * Get all files created during monitoring
     * @returns Array of created file paths
     */
    getCreatedFiles(): string[];
    /**
     * Get all files modified during monitoring
     * @returns Array of modified file paths
     */
    getModifiedFiles(): string[];
    /**
     * Organize project structure
     * @param projectName Name of the project
     * @returns Path to organized project directory
     */
    organizeProject(projectName: string): Promise<string>;
    /**
     * Check if a specific file exists
     * @param filePath Path to the file
     * @returns True if file exists, false otherwise
     */
    fileExists(filePath: string): boolean;
    /**
     * Read file content
     * @param filePath Path to the file
     * @returns File content as string
     */
    readFile(filePath: string): string;
    /**
     * Write content to file
     * @param filePath Path to the file
     * @param content Content to write
     */
    writeFile(filePath: string, content: string): void;
    /**
     * Handle file created event
     * @param filePath Path to the created file
     */
    private handleFileCreated;
    /**
     * Handle file modified event
     * @param filePath Path to the modified file
     */
    private handleFileModified;
    /**
     * Handle file deleted event
     * @param filePath Path to the deleted file
     */
    private handleFileDeleted;
    /**
     * Handle watcher error
     * @param error The error that occurred
     */
    private handleError;
}
