/**
 * Idea Parser for Cursor Composer Automation
 *
 * This module processes idea inputs and converts them into structured prompts for Cursor Composer
 */
import { IdeaInput, ApplicationType } from './core/types';
import * as winston from 'winston';
export declare class IdeaParser {
    private logger;
    private templateDir;
    constructor(logger: winston.Logger, templateDir?: string);
    /**
     * Parse an idea input and generate a structured prompt for Cursor Composer
     * @param idea The idea input to parse
     * @returns Structured prompt for Cursor Composer
     */
    parseIdea(idea: IdeaInput): Promise<string>;
    /**
     * Load template for the given application type
     * @param appType Application type
     * @returns Template string
     */
    private loadTemplate;
    /**
     * Create a default template for prompts
     * @returns Default template string
     */
    private createDefaultTemplate;
    /**
     * Generate a structured prompt from the idea and template
     * @param idea Idea input
     * @param template Template string
     * @returns Structured prompt
     */
    private generatePrompt;
    /**
     * Format application type for display
     * @param appType Application type
     * @returns Formatted application type
     */
    private formatAppType;
    /**
     * Format features as a bullet list
     * @param features List of features
     * @returns Formatted features list
     */
    private formatFeatures;
    /**
     * Format a list as bullet points
     * @param items List items
     * @returns Formatted bullet list
     */
    private formatList;
    static parseIdea(idea: IdeaInput): IdeaInput;
    static validateIdea(idea: IdeaInput): void;
    static formatApplicationType(appType: ApplicationType): string;
}
