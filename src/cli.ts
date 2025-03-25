/**
 * CLI Entry Point for Cursor Composer Automation
 * 
 * This module provides the command-line interface for the automation tool
 */

import { Command } from 'commander';
import * as winston from 'winston';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Orchestrator } from './core/orchestrator';
import { IdeaInput, Configuration, ApplicationType, DeploymentTarget, LogLevel } from './core/types';

// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Define the program
const program = new Command();

program
  .name('cursor-composer-automation')
  .description('Automate the process of Cursor Composer working on an idea to final app deployment')
  .version('1.0.0');

// Command to process an idea from a file
program
  .command('process')
  .description('Process an idea and generate an application')
  .requiredOption('--idea <path>', 'Path to the idea JSON file')
  .option('--output <directory>', 'Output directory for the generated application', './output')
  .option('--type <type>', 'Type of application to generate', 'web')
  .option('--targets <targets>', 'Comma-separated list of deployment targets')
  .option('--log-level <level>', 'Logging level', 'info')
  .action(async (options) => {
    try {
      const config: Configuration = {
        cursorPath: process.env.CURSOR_PATH || '',
        workingDirectory: options.output,
        deploymentSettings: {
          targets: [],
          credentials: {},
          options: {}
        },
        logLevel: options.logLevel as LogLevel,
        serviceMode: false
      };

      if (options.targets) {
        config.deploymentSettings.targets = options.targets.split(',').map((target: string) => {
          return target.trim() as DeploymentTarget;
        });
      }

      const orchestrator = new Orchestrator(config, logger);

      orchestrator.on('status_changed', (status: string) => {
        console.log(`Status changed: ${status}`);
      });

      orchestrator.on('progress_update', (update: { progress: number; message: string }) => {
        console.log(`Progress: ${update.progress}% - ${update.message}`);
      });

      orchestrator.on('error', (error: Error) => {
        console.error('Error:', error);
      });

      const idea: IdeaInput = require(options.idea);
      const result = await orchestrator.processIdea(idea);
      console.log('Application generated successfully:', result);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

// Command to start the service
program
  .command('service')
  .description('Start the automation service')
  .requiredOption('-c, --config <path>', 'Path to configuration file')
  .option('-p, --port <number>', 'Port to listen on', '3000')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (options) => {
    try {
      // Set log level
      if (options.verbose) {
        logger.level = 'debug';
      }
      
      logger.info('Starting Cursor Composer Automation Service');
      
      // Load configuration
      let config: Configuration = {
        cursorPath: '/Applications/Cursor.app/Contents/MacOS/Cursor', // Default for macOS
        workingDirectory: path.resolve('./output'),
        deploymentSettings: {
          targets: [],
          credentials: {},
          options: {}
        },
        logLevel: options.verbose ? LogLevel.DEBUG : LogLevel.INFO,
        serviceMode: true,
        port: parseInt(options.port, 10)
      };
      
      const configPath = path.resolve(options.config);
      if (fs.existsSync(configPath)) {
        try {
          const configContent = fs.readFileSync(configPath, 'utf8');
          const userConfig = JSON.parse(configContent);
          config = { ...config, ...userConfig, serviceMode: true };
          if (options.port) {
            config.port = parseInt(options.port, 10);
          }
        } catch (error) {
          logger.error(`Failed to parse configuration file: ${error}`);
          process.exit(1);
        }
      } else {
        logger.error(`Configuration file not found: ${configPath}`);
        process.exit(1);
      }
      
      // Create orchestrator
      const orchestrator = new Orchestrator(config, logger);
      
      // Start service
      await orchestrator.startService();
      
      // Handle termination signals
      process.on('SIGINT', async () => {
        logger.info('Received SIGINT, shutting down...');
        await orchestrator.stopService();
        process.exit(0);
      });
      
      process.on('SIGTERM', async () => {
        logger.info('Received SIGTERM, shutting down...');
        await orchestrator.stopService();
        process.exit(0);
      });
      
      logger.info(`Service started on port ${config.port}`);
    } catch (error) {
      logger.error(`Unhandled error: ${error}`);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
