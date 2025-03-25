"use strict";
/**
 * CLI Entry Point for Cursor Composer Automation
 *
 * This module provides the command-line interface for the automation tool
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
const commander_1 = require("commander");
const winston = __importStar(require("winston"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const orchestrator_1 = require("./core/orchestrator");
const types_1 = require("./core/types");
// Create logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
// Define the program
const program = new commander_1.Command();
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
        const config = {
            cursorPath: process.env.CURSOR_PATH || '',
            workingDirectory: options.output,
            deploymentSettings: {
                targets: [],
                credentials: {},
                options: {}
            },
            logLevel: options.logLevel,
            serviceMode: false
        };
        if (options.targets) {
            config.deploymentSettings.targets = options.targets.split(',').map((target) => {
                return target.trim();
            });
        }
        const orchestrator = new orchestrator_1.Orchestrator(config, logger);
        orchestrator.on('status_changed', (status) => {
            console.log(`Status changed: ${status}`);
        });
        orchestrator.on('progress_update', (update) => {
            console.log(`Progress: ${update.progress}% - ${update.message}`);
        });
        orchestrator.on('error', (error) => {
            console.error('Error:', error);
        });
        const idea = require(options.idea);
        const result = await orchestrator.processIdea(idea);
        console.log('Application generated successfully:', result);
    }
    catch (error) {
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
        let config = {
            cursorPath: '/Applications/Cursor.app/Contents/MacOS/Cursor', // Default for macOS
            workingDirectory: path.resolve('./output'),
            deploymentSettings: {
                targets: [],
                credentials: {},
                options: {}
            },
            logLevel: options.verbose ? types_1.LogLevel.DEBUG : types_1.LogLevel.INFO,
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
            }
            catch (error) {
                logger.error(`Failed to parse configuration file: ${error}`);
                process.exit(1);
            }
        }
        else {
            logger.error(`Configuration file not found: ${configPath}`);
            process.exit(1);
        }
        // Create orchestrator
        const orchestrator = new orchestrator_1.Orchestrator(config, logger);
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
    }
    catch (error) {
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
