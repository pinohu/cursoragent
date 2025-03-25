"use strict";
/**
 * Cursor Controller for Cursor Composer Automation
 *
 * This module manages the Cursor application and interactions with Composer
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
exports.CursorController = void 0;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const types_1 = require("./core/types");
class CursorController {
    constructor(logger, cursorPath, workingDirectory) {
        this.cursorProcess = null;
        this.isRunning = false;
        this.status = types_1.AutomationStatus.IDLE;
        this.logger = logger;
        this.cursorPath = cursorPath;
        this.workingDirectory = workingDirectory;
        // Ensure working directory exists
        if (!fs.existsSync(this.workingDirectory)) {
            fs.mkdirSync(this.workingDirectory, { recursive: true });
        }
    }
    /**
     * Launch Cursor application
     * @returns Promise resolving when Cursor is launched
     */
    async launchCursor() {
        if (this.isRunning) {
            this.logger.warn('Cursor is already running');
            return;
        }
        this.logger.info('Launching Cursor application');
        try {
            // Check if Cursor exists at the specified path
            if (!fs.existsSync(this.cursorPath)) {
                throw new Error(`Cursor not found at path: ${this.cursorPath}`);
            }
            // Launch Cursor process
            this.cursorProcess = (0, child_process_1.spawn)(this.cursorPath, [this.workingDirectory], {
                detached: true,
                stdio: 'ignore'
            });
            // Handle process events
            this.cursorProcess.on('error', (error) => {
                this.logger.error(`Error launching Cursor: ${error.message}`);
                this.isRunning = false;
                this.cursorProcess = null;
            });
            this.cursorProcess.on('exit', (code) => {
                this.logger.info(`Cursor process exited with code ${code}`);
                this.isRunning = false;
                this.cursorProcess = null;
            });
            // Wait for Cursor to start
            await this.waitForCursorToStart();
            this.isRunning = true;
            this.logger.info('Cursor application launched successfully');
        }
        catch (error) {
            this.logger.error(`Failed to launch Cursor: ${error}`);
            throw error;
        }
    }
    /**
     * Close Cursor application
     * @returns Promise resolving when Cursor is closed
     */
    async closeCursor() {
        if (!this.isRunning || !this.cursorProcess) {
            this.logger.warn('Cursor is not running');
            return;
        }
        this.logger.info('Closing Cursor application');
        try {
            // Send SIGTERM to Cursor process
            this.cursorProcess.kill('SIGTERM');
            // Wait for process to exit
            await new Promise((resolve) => {
                if (!this.cursorProcess) {
                    resolve();
                    return;
                }
                this.cursorProcess.on('exit', () => {
                    resolve();
                });
                // Force kill after timeout
                setTimeout(() => {
                    if (this.cursorProcess) {
                        this.cursorProcess.kill('SIGKILL');
                    }
                    resolve();
                }, 5000);
            });
            this.isRunning = false;
            this.cursorProcess = null;
            this.logger.info('Cursor application closed successfully');
        }
        catch (error) {
            this.logger.error(`Failed to close Cursor: ${error}`);
            throw error;
        }
    }
    /**
     * Activate Composer in Agent mode
     * @returns Promise resolving when Composer is activated
     */
    async activateComposer() {
        if (!this.isRunning) {
            throw new Error('Cursor is not running');
        }
        this.logger.info('Activating Cursor Composer in Agent mode');
        try {
            // Since we can't directly control Cursor UI, we'll use a combination of
            // keyboard simulation and file system monitoring to activate Composer
            // TODO: Implement keyboard simulation to press CMD+I or CMD+SHIFT+I
            // For now, we'll simulate this by creating a special file that a helper script would watch for
            const composerActivationFile = path.join(this.workingDirectory, '.activate_composer');
            fs.writeFileSync(composerActivationFile, 'agent_mode');
            // Wait for Composer to be activated
            await this.waitForComposerActivation();
            this.logger.info('Cursor Composer activated successfully');
        }
        catch (error) {
            this.logger.error(`Failed to activate Composer: ${error}`);
            throw error;
        }
    }
    /**
     * Input prompt to Composer
     * @param prompt The prompt to input
     * @returns Promise resolving when prompt is input
     */
    async inputPrompt(prompt) {
        if (!this.isRunning) {
            throw new Error('Cursor is not running');
        }
        this.logger.info('Inputting prompt to Cursor Composer');
        try {
            // Since we can't directly control Cursor UI, we'll use a file-based approach
            // to communicate with Composer
            const promptFile = path.join(this.workingDirectory, '.composer_prompt');
            fs.writeFileSync(promptFile, prompt);
            // Wait for prompt to be processed
            await this.waitForPromptProcessing();
            this.logger.info('Prompt input to Cursor Composer successfully');
        }
        catch (error) {
            this.logger.error(`Failed to input prompt: ${error}`);
            throw error;
        }
    }
    /**
     * Check if Cursor Composer has completed its task
     * @returns Promise resolving to completion status
     */
    async checkCompletion() {
        if (!this.isRunning) {
            throw new Error('Cursor is not running');
        }
        try {
            // Check for completion indicator file
            const completionFile = path.join(this.workingDirectory, '.composer_completed');
            return fs.existsSync(completionFile);
        }
        catch (error) {
            this.logger.error(`Failed to check completion: ${error}`);
            throw error;
        }
    }
    /**
     * Wait for Cursor to start
     * @returns Promise resolving when Cursor has started
     */
    async waitForCursorToStart() {
        // In a real implementation, we would check for specific indicators
        // that Cursor has started successfully
        // For now, we'll just wait a fixed amount of time
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    /**
     * Wait for Composer to be activated
     * @returns Promise resolving when Composer is activated
     */
    async waitForComposerActivation() {
        // In a real implementation, we would check for specific indicators
        // that Composer has been activated
        // For now, we'll just wait a fixed amount of time
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    /**
     * Wait for prompt to be processed
     * @returns Promise resolving when prompt is processed
     */
    async waitForPromptProcessing() {
        // In a real implementation, we would check for specific indicators
        // that the prompt has been processed
        // For now, we'll just wait a fixed amount of time
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    /**
     * Install cursor-tools CLI
     * @returns Promise resolving when cursor-tools is installed
     */
    async installCursorTools() {
        var _a, _b;
        this.logger.info('Installing cursor-tools CLI');
        try {
            // Execute npm install command
            const installProcess = (0, child_process_1.spawn)('npm', ['install', '-g', 'cursor-tools'], {
                stdio: 'pipe'
            });
            // Collect output
            let output = '';
            (_a = installProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
                output += data.toString();
            });
            (_b = installProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
                output += data.toString();
            });
            // Wait for process to complete
            const exitCode = await new Promise((resolve) => {
                installProcess.on('close', resolve);
            });
            if (exitCode !== 0) {
                throw new Error(`Failed to install cursor-tools: ${output}`);
            }
            this.logger.info('cursor-tools CLI installed successfully');
        }
        catch (error) {
            this.logger.error(`Failed to install cursor-tools: ${error}`);
            throw error;
        }
    }
    /**
     * Configure cursor-tools
     * @returns Promise resolving when cursor-tools is configured
     */
    async configureCursorTools() {
        var _a, _b;
        this.logger.info('Configuring cursor-tools');
        try {
            // Execute cursor-tools install command
            const configProcess = (0, child_process_1.spawn)('cursor-tools', ['install', this.workingDirectory], {
                stdio: 'pipe'
            });
            // Collect output
            let output = '';
            (_a = configProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
                output += data.toString();
            });
            (_b = configProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
                output += data.toString();
            });
            // Wait for process to complete
            const exitCode = await new Promise((resolve) => {
                configProcess.on('close', resolve);
            });
            if (exitCode !== 0) {
                throw new Error(`Failed to configure cursor-tools: ${output}`);
            }
            this.logger.info('cursor-tools configured successfully');
        }
        catch (error) {
            this.logger.error(`Failed to configure cursor-tools: ${error}`);
            throw error;
        }
    }
    async start() {
        this.status = types_1.AutomationStatus.RUNNING;
        // Implementation for starting Cursor
    }
    async stop() {
        this.status = types_1.AutomationStatus.IDLE;
        // Implementation for stopping Cursor
    }
    getStatus() {
        return this.status;
    }
}
exports.CursorController = CursorController;
