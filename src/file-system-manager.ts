/**
 * File System Manager for Cursor Composer Automation
 * 
 * This module tracks and organizes files created by Cursor Composer
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as chokidar from 'chokidar';
import * as winston from 'winston';
import { EventEmitter } from 'events';

export class FileSystemManager extends EventEmitter {
  private logger: winston.Logger;
  private workingDirectory: string;
  private watcher: chokidar.FSWatcher | null = null;
  private createdFiles: Set<string> = new Set();
  private modifiedFiles: Set<string> = new Set();

  constructor(logger: winston.Logger, workingDirectory: string) {
    super();
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
  async startMonitoring(): Promise<void> {
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
      await new Promise<void>((resolve) => {
        if (!this.watcher) {
          resolve();
          return;
        }
        
        this.watcher.on('ready', () => {
          this.logger.info('File system monitoring active');
          resolve();
        });
      });
    } catch (error) {
      this.logger.error(`Failed to start file system monitoring: ${error}`);
      throw error;
    }
  }
  
  /**
   * Stop monitoring file system changes
   * @returns Promise resolving when monitoring is stopped
   */
  async stopMonitoring(): Promise<void> {
    if (!this.watcher) {
      this.logger.warn('File system monitoring is not active');
      return;
    }
    
    this.logger.info('Stopping file system monitoring');
    
    try {
      await this.watcher.close();
      this.watcher = null;
      this.logger.info('File system monitoring stopped');
    } catch (error) {
      this.logger.error(`Failed to stop file system monitoring: ${error}`);
      throw error;
    }
  }
  
  /**
   * Get all files created during monitoring
   * @returns Array of created file paths
   */
  getCreatedFiles(): string[] {
    return Array.from(this.createdFiles);
  }
  
  /**
   * Get all files modified during monitoring
   * @returns Array of modified file paths
   */
  getModifiedFiles(): string[] {
    return Array.from(this.modifiedFiles);
  }
  
  /**
   * Organize project structure
   * @param projectName Name of the project
   * @returns Path to organized project directory
   */
  async organizeProject(projectName: string): Promise<string> {
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
    } catch (error) {
      this.logger.error(`Failed to organize project: ${error}`);
      throw error;
    }
  }
  
  /**
   * Check if a specific file exists
   * @param filePath Path to the file
   * @returns True if file exists, false otherwise
   */
  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
  
  /**
   * Read file content
   * @param filePath Path to the file
   * @returns File content as string
   */
  readFile(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      this.logger.error(`Failed to read file ${filePath}: ${error}`);
      throw error;
    }
  }
  
  /**
   * Write content to file
   * @param filePath Path to the file
   * @param content Content to write
   */
  writeFile(filePath: string, content: string): void {
    try {
      // Ensure directory exists
      fs.ensureDirSync(path.dirname(filePath));
      
      // Write file
      fs.writeFileSync(filePath, content);
      this.logger.debug(`Wrote to file ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to write to file ${filePath}: ${error}`);
      throw error;
    }
  }
  
  /**
   * Handle file created event
   * @param filePath Path to the created file
   */
  private handleFileCreated(filePath: string): void {
    this.createdFiles.add(filePath);
    this.logger.debug(`File created: ${filePath}`);
    this.emit('file-created', filePath);
  }
  
  /**
   * Handle file modified event
   * @param filePath Path to the modified file
   */
  private handleFileModified(filePath: string): void {
    this.modifiedFiles.add(filePath);
    this.logger.debug(`File modified: ${filePath}`);
    this.emit('file-modified', filePath);
  }
  
  /**
   * Handle file deleted event
   * @param filePath Path to the deleted file
   */
  private handleFileDeleted(filePath: string): void {
    this.createdFiles.delete(filePath);
    this.modifiedFiles.delete(filePath);
    this.logger.debug(`File deleted: ${filePath}`);
    this.emit('file-deleted', filePath);
  }
  
  /**
   * Handle watcher error
   * @param error The error that occurred
   */
  private handleError(error: Error): void {
    this.logger.error(`File system monitoring error: ${error.message}`);
    this.emit('error', error);
  }
}
