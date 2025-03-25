"use strict";
/**
 * Idea Parser for Cursor Composer Automation
 *
 * This module processes idea inputs and converts them into structured prompts for Cursor Composer
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
exports.IdeaParser = void 0;
const types_1 = require("./core/types");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class IdeaParser {
    constructor(logger, templateDir = path.join(__dirname, '../../templates')) {
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
    async parseIdea(idea) {
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
    async loadTemplate(appType) {
        const templatePath = path.join(this.templateDir, `${appType.toLowerCase()}.template`);
        try {
            if (fs.existsSync(templatePath)) {
                return fs.readFile(templatePath, 'utf8');
            }
            else {
                // Use default template if specific one doesn't exist
                const defaultTemplatePath = path.join(this.templateDir, 'default.template');
                if (fs.existsSync(defaultTemplatePath)) {
                    return fs.readFile(defaultTemplatePath, 'utf8');
                }
                else {
                    // Create and return a basic template if none exists
                    return this.createDefaultTemplate();
                }
            }
        }
        catch (error) {
            this.logger.error(`Error loading template: ${error}`);
            return this.createDefaultTemplate();
        }
    }
    /**
     * Create a default template for prompts
     * @returns Default template string
     */
    createDefaultTemplate() {
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
    generatePrompt(idea, template) {
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
        }
        else {
            // Remove frameworks section if not provided
            prompt = prompt.replace(/{{#if frameworks}}[\s\S]*?{{\/if}}/g, '');
        }
        if (idea.additionalContext) {
            prompt = prompt.replace('{{#if additionalContext}}', '')
                .replace('{{/if}}', '')
                .replace('{{additionalContext}}', idea.additionalContext);
        }
        else {
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
    formatAppType(appType) {
        return appType.toString().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
    /**
     * Format features as a bullet list
     * @param features List of features
     * @returns Formatted features list
     */
    formatFeatures(features) {
        return this.formatList(features);
    }
    /**
     * Format a list as bullet points
     * @param items List items
     * @returns Formatted bullet list
     */
    formatList(items) {
        return items.map(item => `- ${item}`).join('\n');
    }
    static parseIdea(idea) {
        // Validate required fields
        if (!idea.name || !idea.description) {
            throw new Error('Idea must have a name and description');
        }
        // Set default values
        const parsedIdea = {
            name: idea.name,
            title: idea.title || idea.name, // Use name as title if title is not provided
            description: idea.description,
            type: idea.type || types_1.ApplicationType.WEB,
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
    static validateIdea(idea) {
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
        if (!Object.values(types_1.ApplicationType).includes(idea.type)) {
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
    static formatApplicationType(appType) {
        return appType.toString().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    }
}
exports.IdeaParser = IdeaParser;
