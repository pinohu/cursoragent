/**
 * Idea Parser for Cursor Composer Automation
 * 
 * This module processes idea inputs and converts them into structured prompts for Cursor Composer
 */

import { IdeaInput, ApplicationType } from './core/types';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as winston from 'winston';

export class IdeaParser {
  private logger: winston.Logger;
  private templateDir: string;

  constructor(logger: winston.Logger, templateDir: string = path.join(__dirname, '../../templates')) {
    this.logger = logger;
    this.templateDir = templateDir;
    
    // Ensure template directory exists
    if (!fs.existsSync(this.templateDir)) {
      fs.mkdirSync(this.templateDir, { recursive: true });
    }
  }

  /**
   * Parse an idea input and generate a structured prompt for Cursor Composer
   * @param idea The idea input to parse
   * @returns Structured prompt for Cursor Composer
   */
  async parseIdea(idea: IdeaInput): Promise<string> {
    this.logger.info(`Parsing idea: ${idea.title}`);
    
    // Load appropriate template based on application type
    const template = await this.loadTemplate(idea.type);
    
    // Generate structured prompt
    const prompt = this.generatePrompt(idea, template);
    
    this.logger.debug(`Generated prompt for idea: ${idea.title}`);
    return prompt;
  }
  
  /**
   * Load template for the given application type
   * @param appType Application type
   * @returns Template string
   */
  private async loadTemplate(appType: ApplicationType): Promise<string> {
    const templatePath = path.join(this.templateDir, `${appType.toLowerCase()}.template`);
    
    try {
      if (fs.existsSync(templatePath)) {
        return fs.readFile(templatePath, 'utf8');
      } else {
        // Use default template if specific one doesn't exist
        const defaultTemplatePath = path.join(this.templateDir, 'default.template');
        
        if (fs.existsSync(defaultTemplatePath)) {
          return fs.readFile(defaultTemplatePath, 'utf8');
        } else {
          // Create and return a basic template if none exists
          return this.createDefaultTemplate();
        }
      }
    } catch (error) {
      this.logger.error(`Error loading template: ${error}`);
      return this.createDefaultTemplate();
    }
  }
  
  /**
   * Create a default template for prompts
   * @returns Default template string
   */
  private createDefaultTemplate(): string {
    const defaultTemplate = `
# {{title}}

## Description
{{description}}

## Application Type
{{type}}

## Features
{{features}}

{{#if frameworks}}
## Frameworks/Technologies to Use
{{frameworks}}
{{/if}}

{{#if additionalContext}}
## Additional Context
{{additionalContext}}
{{/if}}

Please create a complete application based on the above requirements. The application should be well-structured, follow best practices, and include appropriate documentation.
`;
    
    // Save the default template for future use
    const defaultTemplatePath = path.join(this.templateDir, 'default.template');
    fs.writeFileSync(defaultTemplatePath, defaultTemplate);
    
    return defaultTemplate;
  }
  
  /**
   * Generate a structured prompt from the idea and template
   * @param idea Idea input
   * @param template Template string
   * @returns Structured prompt
   */
  private generatePrompt(idea: IdeaInput, template: string): string {
    // Simple template variable replacement
    let prompt = template
      .replace('{{title}}', idea.title)
      .replace('{{description}}', idea.description)
      .replace('{{type}}', this.formatAppType(idea.type))
      .replace('{{features}}', this.formatFeatures(idea.features));
    
    // Handle optional sections
    if (idea.frameworks && idea.frameworks.length > 0) {
      prompt = prompt.replace('{{#if frameworks}}', '')
                     .replace('{{/if}}', '')
                     .replace('{{frameworks}}', this.formatList(idea.frameworks));
    } else {
      // Remove frameworks section if not provided
      prompt = prompt.replace(/{{#if frameworks}}[\s\S]*?{{\/if}}/g, '');
    }
    
    if (idea.additionalContext) {
      prompt = prompt.replace('{{#if additionalContext}}', '')
                     .replace('{{/if}}', '')
                     .replace('{{additionalContext}}', idea.additionalContext);
    } else {
      // Remove additional context section if not provided
      prompt = prompt.replace(/{{#if additionalContext}}[\s\S]*?{{\/if}}/g, '');
    }
    
    // Add deployment targets if specified
    if (idea.deploymentTarget && idea.deploymentTarget.length > 0) {
      prompt += `\n\n## Deployment Targets\n${this.formatList(idea.deploymentTarget)}\n`;
    }
    
    return prompt;
  }
  
  /**
   * Format application type for display
   * @param appType Application type
   * @returns Formatted application type
   */
  private formatAppType(appType: ApplicationType): string {
    return appType.toString().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  
  /**
   * Format features as a bullet list
   * @param features List of features
   * @returns Formatted features list
   */
  private formatFeatures(features: string[]): string {
    return this.formatList(features);
  }
  
  /**
   * Format a list as bullet points
   * @param items List items
   * @returns Formatted bullet list
   */
  private formatList(items: string[]): string {
    return items.map(item => `- ${item}`).join('\n');
  }

  public static parseIdea(idea: IdeaInput): IdeaInput {
    // Validate required fields
    if (!idea.name || !idea.description) {
      throw new Error('Idea must have a name and description');
    }

    // Set default values
    const parsedIdea: IdeaInput = {
      name: idea.name,
      title: idea.title || idea.name, // Use name as title if title is not provided
      description: idea.description,
      type: idea.type || ApplicationType.WEB,
      features: idea.features || [],
      technologies: idea.technologies || [],
      dependencies: idea.dependencies || [],
      deployment: idea.deployment || {
        targets: [],
        settings: {}
      }
    };

    return parsedIdea;
  }

  public static validateIdea(idea: IdeaInput): void {
    // Validate name
    if (!idea.name || typeof idea.name !== 'string') {
      throw new Error('Idea name must be a non-empty string');
    }

    // Validate title
    if (!idea.title && !idea.name) {
      throw new Error('Idea must have either a title or a name');
    }

    // Validate description
    if (!idea.description || typeof idea.description !== 'string') {
      throw new Error('Idea description must be a non-empty string');
    }

    // Validate type
    if (!Object.values(ApplicationType).includes(idea.type)) {
      throw new Error(`Invalid application type: ${idea.type}`);
    }

    // Validate features
    if (idea.features && !Array.isArray(idea.features)) {
      throw new Error('Features must be an array');
    }

    // Validate technologies
    if (idea.technologies && !Array.isArray(idea.technologies)) {
      throw new Error('Technologies must be an array');
    }

    // Validate dependencies
    if (idea.dependencies && !Array.isArray(idea.dependencies)) {
      throw new Error('Dependencies must be an array');
    }

    // Validate deployment
    if (idea.deployment) {
      if (!Array.isArray(idea.deployment.targets)) {
        throw new Error('Deployment targets must be an array');
      }
      if (typeof idea.deployment.settings !== 'object') {
        throw new Error('Deployment settings must be an object');
      }
    }
  }

  public static formatApplicationType(appType: ApplicationType): string {
    return appType.toString().replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  }
}
