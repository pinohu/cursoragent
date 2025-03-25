/**
 * Service Entry Point for Cursor Composer Automation
 * 
 * This module provides the service/daemon interface for the automation tool
 */

import express from 'express';
import * as bodyParser from 'body-parser';
import * as winston from 'winston';
import * as path from 'path';
import { Orchestrator } from './core/orchestrator';
import { IdeaInput, Configuration, AutomationStatus } from './core/types';

export class AutomationService {
  private app: express.Application;
  private orchestrator: Orchestrator;
  private logger: winston.Logger;
  private config: Configuration;
  private activeJobs: Map<string, { status: AutomationStatus, progress: number }> = new Map();

  constructor(config: Configuration, logger: winston.Logger) {
    this.config = config;
    this.logger = logger;
    this.orchestrator = new Orchestrator(config, logger);
    this.app = express();
    
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
  async start(): Promise<void> {
    return new Promise<void>((resolve) => {
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
  async stop(): Promise<void> {
    // Cleanup logic would go here
    this.logger.info('Automation service stopped');
  }
  
  /**
   * Set up service routes
   */
  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });
    
    // Process idea endpoint
    this.app.post('/process', async (req, res) => {
      try {
        const idea: IdeaInput = req.body.idea;
        
        if (!idea) {
          return res.status(400).json({ error: 'Idea input is required' });
        }
        
        // Generate job ID
        const jobId = this.generateJobId();
        
        // Initialize job status
        this.activeJobs.set(jobId, { status: AutomationStatus.INITIALIZING, progress: 0 });
        
        // Start processing in background
        this.processIdea(jobId, idea);
        
        // Return job ID
        res.status(202).json({ jobId });
      } catch (error) {
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
      const jobs: Record<string, { status: AutomationStatus, progress: number }> = {};
      
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
  private async processIdea(jobId: string, idea: IdeaInput): Promise<void> {
    try {
      // Set up event listeners
      this.orchestrator.on('status_changed', (status: AutomationStatus) => {
        const currentJob = this.activeJobs.get(jobId);
        if (currentJob) {
          this.activeJobs.set(jobId, { ...currentJob, status });
        }
      });
      
      this.orchestrator.on('progress_update', (update: { progress: number; message: string }) => {
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
        progress: result.status === AutomationStatus.COMPLETED ? 100 : 0 
      });
      
      // Clean up job after some time
      setTimeout(() => {
        this.activeJobs.delete(jobId);
      }, 3600000); // Remove after 1 hour
    } catch (error) {
      this.logger.error(`Error processing job ${jobId}: ${error}`);
      
      // Update job status with error
      this.activeJobs.set(jobId, { 
        status: AutomationStatus.FAILED, 
        progress: 0 
      });
    }
  }
  
  /**
   * Generate unique job ID
   * @returns Unique job ID
   */
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupEventHandlers(): void {
    this.orchestrator.on('status_changed', (status: AutomationStatus) => {
      this.logger.info(`Status changed: ${status}`);
    });

    this.orchestrator.on('progress_update', (update: { progress: number; message: string }) => {
      this.logger.info(`Progress: ${update.progress}% - ${update.message}`);
    });

    this.orchestrator.on('error', (error: Error) => {
      this.logger.error('Error:', error);
    });
  }
}
