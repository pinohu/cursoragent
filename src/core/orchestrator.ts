import { EventEmitter } from 'events';
import { IdeaInput, Configuration, AutomationStatus, AutomationResult } from './types';
import { CursorController } from '../cursor-controller';
import { DeploymentManager } from '../deployment-manager';
import { IdeaParser } from '../idea-parser';
import * as winston from 'winston';

export class Orchestrator extends EventEmitter {
  private config: Configuration;
  private cursorController: CursorController;
  private deploymentManager: DeploymentManager;
  private status: AutomationStatus = AutomationStatus.IDLE;
  private logger: winston.Logger;

  constructor(config: Configuration, logger: winston.Logger) {
    super();
    this.config = config;
    this.logger = logger;
    this.cursorController = new CursorController(logger, config.cursorPath, config.workingDirectory);
    this.deploymentManager = new DeploymentManager(logger, config.deploymentSettings);
  }

  public async startService(): Promise<void> {
    this.status = AutomationStatus.INITIALIZING;
    this.emit('status_changed', this.status);
    await this.cursorController.start();
    this.status = AutomationStatus.IDLE;
    this.emit('status_changed', this.status);
  }

  public async stopService(): Promise<void> {
    this.status = AutomationStatus.CANCELLED;
    this.emit('status_changed', this.status);
    await this.cursorController.stop();
    this.status = AutomationStatus.IDLE;
    this.emit('status_changed', this.status);
  }

  public async processIdea(idea: IdeaInput): Promise<AutomationResult> {
    try {
      this.status = AutomationStatus.RUNNING;
      this.emit('status_changed', this.status);

      // Validate and parse idea
      IdeaParser.validateIdea(idea);
      const parsedIdea = IdeaParser.parseIdea(idea);

      // Start Cursor
      await this.cursorController.start();
      this.emit('progress_update', { progress: 20, message: 'Cursor started' });

      // Process idea with Cursor
      // This is where we would integrate with Cursor's API
      this.emit('progress_update', { progress: 50, message: 'Processing idea with Cursor' });

      // Deploy if targets specified
      const deploymentUrls: Record<string, string> = {};
      if (parsedIdea.deployment?.targets.length) {
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

      this.status = AutomationStatus.COMPLETED;
      this.emit('status_changed', this.status);

      return {
        status: AutomationStatus.COMPLETED,
        deploymentUrls
      };
    } catch (error: unknown) {
      this.status = AutomationStatus.FAILED;
      this.emit('status_changed', this.status);
      this.emit('error', error instanceof Error ? error : new Error(String(error)));

      return {
        status: AutomationStatus.FAILED,
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  public getStatus(): AutomationStatus {
    return this.status;
  }
} 