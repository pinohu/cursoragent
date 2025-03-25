/**
 * Deployment Manager for Cursor Composer Automation
 * 
 * This module handles packaging and deployment of applications generated by Cursor Composer
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as winston from 'winston';
import { spawn } from 'child_process';
import { DeploymentTarget, DeploymentSettings } from './core/types';

export class DeploymentManager {
  private logger: winston.Logger;
  private settings: DeploymentSettings;

  constructor(logger: winston.Logger, settings: DeploymentSettings) {
    this.logger = logger;
    this.settings = settings;
  }

  /**
   * Deploy application to specified targets
   * @param projectDir Path to the project directory
   * @returns Object mapping deployment targets to their URLs
   */
  async deployApplication(projectDir: string): Promise<Record<string, string>> {
    this.logger.info(`Deploying application from ${projectDir}`);
    
    try {
      // Detect application type and framework
      const appInfo = await this.detectApplicationType(projectDir);
      this.logger.info(`Detected application type: ${appInfo.type}, framework: ${appInfo.framework}`);
      
      // Package application
      await this.packageApplication(projectDir, appInfo);
      
      // Deploy to each target
      const deploymentUrls: Record<string, string> = {};
      
      for (const target of this.settings.targets) {
        try {
          const url = await this.deployToTarget(projectDir, target, appInfo);
          deploymentUrls[target] = url;
          this.logger.info(`Deployed to ${target}: ${url}`);
        } catch (error) {
          this.logger.error(`Failed to deploy to ${target}: ${error}`);
          // Continue with other targets even if one fails
        }
      }
      
      return deploymentUrls;
    } catch (error) {
      this.logger.error(`Deployment failed: ${error}`);
      throw error;
    }
  }
  
  /**
   * Detect application type and framework
   * @param projectDir Path to the project directory
   * @returns Object with type and framework information
   */
  private async detectApplicationType(projectDir: string): Promise<{ type: string, framework: string }> {
    try {
      // Check for package.json
      const packageJsonPath = path.join(projectDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Check for common frameworks in dependencies
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        if (dependencies.next) {
          return { type: 'web_app', framework: 'nextjs' };
        } else if (dependencies.react) {
          return { type: 'web_app', framework: 'react' };
        } else if (dependencies.vue) {
          return { type: 'web_app', framework: 'vue' };
        } else if (dependencies.angular) {
          return { type: 'web_app', framework: 'angular' };
        } else if (dependencies.express) {
          return { type: 'api', framework: 'express' };
        } else if (dependencies['@nestjs/core']) {
          return { type: 'api', framework: 'nestjs' };
        }
      }
      
      // Check for specific files
      if (fs.existsSync(path.join(projectDir, 'index.html'))) {
        return { type: 'web_app', framework: 'static' };
      }
      
      // Default to generic web app
      return { type: 'web_app', framework: 'unknown' };
    } catch (error) {
      this.logger.error(`Failed to detect application type: ${error}`);
      return { type: 'unknown', framework: 'unknown' };
    }
  }
  
  /**
   * Package application for deployment
   * @param projectDir Path to the project directory
   * @param appInfo Application type and framework information
   */
  private async packageApplication(projectDir: string, appInfo: { type: string, framework: string }): Promise<void> {
    this.logger.info(`Packaging application for deployment`);
    
    try {
      // Install dependencies
      await this.runCommand('npm', ['install'], projectDir);
      
      // Build application based on framework
      switch (appInfo.framework) {
        case 'nextjs':
          await this.runCommand('npm', ['run', 'build'], projectDir);
          break;
        case 'react':
          await this.runCommand('npm', ['run', 'build'], projectDir);
          break;
        case 'vue':
          await this.runCommand('npm', ['run', 'build'], projectDir);
          break;
        case 'angular':
          await this.runCommand('npm', ['run', 'build'], projectDir);
          break;
        case 'express':
        case 'nestjs':
          await this.runCommand('npm', ['run', 'build'], projectDir);
          break;
        default:
          // For static sites or unknown frameworks, no build step
          break;
      }
      
      this.logger.info('Application packaged successfully');
    } catch (error) {
      this.logger.error(`Failed to package application: ${error}`);
      throw error;
    }
  }
  
  /**
   * Deploy application to a specific target
   * @param projectDir Path to the project directory
   * @param target Deployment target
   * @param appInfo Application type and framework information
   * @returns Deployment URL
   */
  private async deployToTarget(
    projectDir: string, 
    target: DeploymentTarget, 
    appInfo: { type: string, framework: string }
  ): Promise<string> {
    this.logger.info(`Deploying to ${target}`);
    
    switch (target) {
      case DeploymentTarget.VERCEL:
        return this.deployToVercel(projectDir, appInfo);
      case DeploymentTarget.NETLIFY:
        return this.deployToNetlify(projectDir, appInfo);
      case DeploymentTarget.AWS:
        return this.deployToAWS(projectDir, appInfo);
      case DeploymentTarget.AZURE:
        return this.deployToAzure(projectDir, appInfo);
      case DeploymentTarget.GCP:
        return this.deployToGCP(projectDir, appInfo);
      case DeploymentTarget.HEROKU:
        return this.deployToHeroku(projectDir, appInfo);
      case DeploymentTarget.DIGITAL_OCEAN:
        return this.deployToDigitalOcean(projectDir, appInfo);
      case DeploymentTarget.GITHUB_PAGES:
        return this.deployToGitHubPages(projectDir, appInfo);
      case DeploymentTarget.CUSTOM:
        return this.deployToCustom(projectDir, appInfo);
      default:
        throw new Error(`Unsupported deployment target: ${target}`);
    }
  }
  
  /**
   * Deploy to Vercel
   * @param projectDir Path to the project directory
   * @param appInfo Application type and framework information
   * @returns Deployment URL
   */
  private async deployToVercel(projectDir: string, appInfo: { type: string, framework: string }): Promise<string> {
    try {
      // Install Vercel CLI if not already installed
      await this.runCommand('npm', ['install', '-g', 'vercel'], projectDir);
      
      // Deploy to Vercel
      const output = await this.runCommandWithOutput('vercel', ['--prod'], projectDir);
      
      // Extract deployment URL from output
      const urlMatch = output.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/);
      if (urlMatch) {
        return urlMatch[0];
      } else {
        throw new Error('Could not extract deployment URL from Vercel output');
      }
    } catch (error) {
      this.logger.error(`Failed to deploy to Vercel: ${error}`);
      throw error;
    }
  }
  
  /**
   * Deploy to Netlify
   * @param projectDir Path to the project directory
   * @param appInfo Application type and framework information
   * @returns Deployment URL
   */
  private async deployToNetlify(projectDir: string, appInfo: { type: string, framework: string }): Promise<string> {
    try {
      // Install Netlify CLI if not already installed
      await this.runCommand('npm', ['install', '-g', 'netlify-cli'], projectDir);
      
      // Determine publish directory based on framework
      let publishDir = 'build';
      if (appInfo.framework === 'nextjs') {
        publishDir = '.next';
      } else if (appInfo.framework === 'vue') {
        publishDir = 'dist';
      } else if (appInfo.framework === 'angular') {
        publishDir = 'dist';
      }
      
      // Deploy to Netlify
      const output = await this.runCommandWithOutput(
        'netlify', 
        ['deploy', '--dir', publishDir, '--prod'], 
        projectDir
      );
      
      // Extract deployment URL from output
      const urlMatch = output.match(/https:\/\/[a-zA-Z0-9.-]+\.netlify\.app/);
      if (urlMatch) {
        return urlMatch[0];
      } else {
        throw new Error('Could not extract deployment URL from Netlify output');
      }
    } catch (error) {
      this.logger.error(`Failed to deploy to Netlify: ${error}`);
      throw error;
    }
  }
  
  /**
   * Deploy to AWS
   * @param projectDir Path to the project directory
   * @param appInfo Application type and framework information
   * @returns Deployment URL
   */
  private async deployToAWS(projectDir: string, appInfo: { type: string, framework: string }): Promise<string> {
    // Implementation for AWS deployment would go here
    // This is a placeholder that would need to be implemented with actual AWS deployment logic
    return 'https://example-aws-deployment.com';
  }
  
  /**
   * Deploy to Azure
   * @param projectDir Path to the project directory
   * @param appInfo Application type and framework information
   * @returns Deployment URL
   */
  private async deployToAzure(projectDir: string, appInfo: { type: string, framework: string }): Promise<string> {
    // Implementation for Azure deployment would go here
    // This is a placeholder that would need to be implemented with actual Azure deployment logic
    return 'https://example-azure-deployment.com';
  }
  
  /**
   * Deploy to GCP
   * @param projectDir Path to the project directory
   * @param appInfo Application type and framework information
   * @returns Deployment URL
   */
  private async deployToGCP(projectDir: string, appInfo: { type: string, framework: string }): Promise<string> {
    // Implementation for GCP deployment would go here
    // This is a placeholder that would need to be implemented with actual GCP deployment logic
    return 'https://example-gcp-deployment.com';
  }
  
  /**
   * Deploy to Heroku
   * @param projectDir Path to the project directory
   * @param appInfo Application type and framework information
   * @returns Deployment URL
   */
  private async deployToHeroku(projectDir: string, appInfo: { type: string, framework: string }): Promise<string> {
    // Implementation for Heroku deployment would go here
    // This is a placeholder that would need to be implemented with actual Heroku deployment logic
    return 'https://example-heroku-deployment.com';
  }
  
  /**
   * Deploy to Digital Ocean
   * @param projectDir Path to the project directory
   * @param appInfo Application type and framework information
   * @returns Deployment URL
   */
  private async deployToDigitalOcean(projectDir: string, appInfo: { type: string, framework: string }): Promise<string> {
    // Implementation for Digital Ocean deployment would go here
    // This is a placeholder that would need to be implemented with actual Digital Ocean deployment logic
    return 'https://example-digitalocean-deployment.com';
  }
  
  /**
   * Deploy to GitHub Pages
   * @param projectDir Path to the project directory
   * @param appInfo Application type and framework information
   * @returns Deployment URL
   */
  private async deployToGitHubPages(projectDir: string, appInfo: { type: string, framework: string }): Promise<string> {
    // Implementation for GitHub Pages deployment would go here
    // This is a placeholder that would need to be implemented with actual GitHub Pages deployment logic
    return 'https://example-github-pages-deployment.com';
  }
  
  /**
   * Deploy to custom target
   * @param projectDir Path to the project directory
   * @param appInfo Application type and framework information
   * @returns Deployment URL
   */
  private async deployToCustom(projectDir: string, appInfo: { type: string, framework: string }): Promise<string> {
    // Implementation for custom deployment would go here
    // This is a placeholder that would need to be implemented with custom deployment logic
    return 'https://example-custom-deployment.com';
  }
  
  /**
   * Run command in specified directory
   * @param command Command to run
   * @param args Command arguments
   * @param cwd Working directory
   * @returns Promise resolving when command completes
   */
  private async runCommand(command: string, args: string[], cwd: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const process = spawn(command, args, { cwd });
      
      process.on('error', (error) => {
        reject(error);
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command ${command} ${args.join(' ')} failed with code ${code}`));
        }
      });
    });
  }
  
  /**
   * Run command and capture output
   * @param command Command to run
   * @param args Command arguments
   * @param cwd Working directory
   * @returns Promise resolving to command output
   */
  private async runCommandWithOutput(command: string, args: string[], cwd: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const process = spawn(command, args, { cwd });
      
      let output = '';
      
      process.stdout?.on('data', (data) => {
        output += data.toString();
      });
      
      process.stderr?.on('data', (data) => {
        output += data.toString();
      });
      
      process.on('error', (error) => {
        reject(error);
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Command ${command} ${args.join(' ')} failed with code ${code}`));
        }
      });
    });
  }

  public async deploy(target: DeploymentTarget): Promise<string> {
    // Implementation for deploying to the specified target
    return `https://${target.toLowerCase()}.example.com`;
  }

  public async getDeploymentStatus(target: DeploymentTarget): Promise<string> {
    // Implementation for getting deployment status
    return 'deployed';
  }
}
