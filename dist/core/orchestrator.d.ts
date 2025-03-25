import { EventEmitter } from 'events';
import { IdeaInput, Configuration, AutomationStatus, AutomationResult } from './types';
import * as winston from 'winston';
export declare class Orchestrator extends EventEmitter {
    private config;
    private cursorController;
    private deploymentManager;
    private status;
    private logger;
    constructor(config: Configuration, logger: winston.Logger);
    startService(): Promise<void>;
    stopService(): Promise<void>;
    processIdea(idea: IdeaInput): Promise<AutomationResult>;
    getStatus(): AutomationStatus;
}
