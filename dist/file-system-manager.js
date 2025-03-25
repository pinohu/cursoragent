"use strict";
/**
 * File System Manager for Cursor Composer Automation
 *
 * This module tracks and organizes files created by Cursor Composer
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemManager = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const chokidar = __importStar(require("chokidar"));
const events_1 = require("events");
class FileSystemManager extends events_1.EventEmitter {
    constructor(logger, workingDirectory) {
        super();
        this.watcher = null;
        this.createdFiles = new Set();
        this.modifiedFiles = new Set();
        this.logger = logger;
        this.workingDirectory = workingDirectory;
        // Ensure working directory exists
        if (!fs.existsSync(this.workingDirectory)) {
            fs.mkdirSync(this.workingDirectory, { recursive: true });
        }
    }
    /**
     * Start monitoring file system changes
     * @returns Promise resolving when monitoring is started
     */
    async startMonitoring() {
        if (this.watcher) {
            this.logger.warn('File system monitoring is already active');
            return;
        }
        this.logger.info(`Starting file system monitoring in ${this.workingDirectory}`);
        try {
            // Initialize file sets
            this.createdFiles.clear();
            this.modifiedFiles.clear();
            // Create watcher
            this.watcher = chokidar.watch(this.workingDirectory, {
                ignored: /(^|[\/\\])\../, // Ignore dot files
                persistent: true,
                ignoreInitial: true,
                awaitWriteFinish: {
                    stabilityThreshold: 2000,
                    pollInterval: 100
                }
            });
            // Set up event handlers
            this.watcher.on('add', (filePath) => this.handleFileCreated(filePath));
            this.watcher.on('change', (filePath) => this.handleFileModified(filePath));
            this.watcher.on('unlink', (filePath) => this.handleFileDeleted(filePath));
            this.watcher.on('error', (error) => this.handleError(error));
            // Wait for watcher to be ready
            await new Promise((resolve) => {
                if (!this.watcher) {
                    resolve();
                    return;
                }
                this.watcher.on('ready', () => {
                    this.logger.info('File system monitoring active');
                    resolve();
                });
            });
        }
        catch (error) {
            this.logger.error(`Failed to start file system monitoring: ${error}`);
            throw error;
        }
    }
    /**
     * Stop monitoring file system changes
     * @returns Promise resolving when monitoring is stopped
     */
    async stopMonitoring() {
        if (!this.watcher) {
            this.logger.warn('File system monitoring is not active');
            return;
        }
        this.logger.info('Stopping file system monitoring');
        try {
            await this.watcher.close();
            this.watcher = null;
            this.logger.info('File system monitoring stopped');
        }
        catch (error) {
            this.logger.error(`Failed to stop file system monitoring: ${error}`);
            throw error;
        }
    }
    /**
     * Get all files created during monitoring
     * @returns Array of created file paths
     */
    getCreatedFiles() {
        return Array.from(this.createdFiles);
    }
    /**
     * Get all files modified during monitoring
     * @returns Array of modified file paths
     */
    getModifiedFiles() {
        return Array.from(this.modifiedFiles);
    }
    /**
     * Organize project structure
     * @param projectName Name of the project
     * @returns Path to organized project directory
     */
    async organizeProject(projectName) {
        this.logger.info(`Organizing project structure for ${projectName}`);
        try {
            // Create project directory
            const projectDir = path.join(this.workingDirectory, projectName);
            fs.ensureDirSync(projectDir);
            // Get all created and modified files
            const allFiles = new Set([...this.getCreatedFiles(), ...this.getModifiedFiles()]);
            // Copy files to project directory maintaining relative paths
            for (const filePath of allFiles) {
                const relativePath = path.relative(this.workingDirectory, filePath);
                const targetPath = path.join(projectDir, relativePath);
                // Ensure target directory exists
                fs.ensureDirSync(path.dirname(targetPath));
                // Copy file
                fs.copyFileSync(filePath, targetPath);
                this.logger.debug(`Copied ${filePath} to ${targetPath}`);
            }
            this.logger.info(`Project organized at ${projectDir}`);
            return projectDir;
        }
        catch (error) {
            this.logger.error(`Failed to organize project: ${error}`);
            throw error;
        }
    }
    /**
     * Check if a specific file exists
     * @param filePath Path to the file
     * @returns True if file exists, false otherwise
     */
    fileExists(filePath) {
        return fs.existsSync(filePath);
    }
    /**
     * Read file content
     * @param filePath Path to the file
     * @returns File content as string
     */
    readFile(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        }
        catch (error) {
            this.logger.error(`Failed to read file ${filePath}: ${error}`);
            throw error;
        }
    }
    /**
     * Write content to file
     * @param filePath Path to the file
     * @param content Content to write
     */
    writeFile(filePath, content) {
        try {
            // Ensure directory exists
            fs.ensureDirSync(path.dirname(filePath));
            // Write file
            fs.writeFileSync(filePath, content);
            this.logger.debug(`Wrote to file ${filePath}`);
        }
        catch (error) {
            this.logger.error(`Failed to write to file ${filePath}: ${error}`);
            throw error;
        }
    }
    /**
     * Handle file created event
     * @param filePath Path to the created file
     */
    handleFileCreated(filePath) {
        this.createdFiles.add(filePath);
        this.logger.debug(`File created: ${filePath}`);
        this.emit('file-created', filePath);
    }
    /**
     * Handle file modified event
     * @param filePath Path to the modified file
     */
    handleFileModified(filePath) {
        this.modifiedFiles.add(filePath);
        this.logger.debug(`File modified: ${filePath}`);
        this.emit('file-modified', filePath);
    }
    /**
     * Handle file deleted event
     * @param filePath Path to the deleted file
     */
    handleFileDeleted(filePath) {
        this.createdFiles.delete(filePath);
        this.modifiedFiles.delete(filePath);
        this.logger.debug(`File deleted: ${filePath}`);
        this.emit('file-deleted', filePath);
    }
    /**
     * Handle watcher error
     * @param error The error that occurred
     */
    handleError(error) {
        this.logger.error(`File system monitoring error: ${error.message}`);
        this.emit('error', error);
    }
}
exports.FileSystemManager = FileSystemManager;
