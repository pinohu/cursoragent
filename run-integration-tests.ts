#!/usr/bin/env node

/**
 * Integration test script for Cursor Composer Automation
 * 
 * This script tests the automation solution with sample ideas using mock implementations
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import * as winston from 'winston';
import { MockOrchestrator } from './mocks';
import { IdeaInput } from '../src/core/types';

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
    new winston.transports.File({ filename: 'test-integration-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'test-integration-combined.log' })
  ]
});

// Sample ideas directory
const samplesDir = path.resolve('./tests/sample_ideas');
const outputDir = path.resolve('./test-integration-output');

/**
 * Run integration tests with sample ideas
 */
async function runIntegrationTests() {
  logger.info('Starting integration tests');
  
  // Create output directory if it doesn't exist
  fs.ensureDirSync(outputDir);
  
  // Get all sample idea files
  const sampleFiles = fs.readdirSync(samplesDir)
    .filter(file => file.endsWith('.json'));
  
  logger.info(`Found ${sampleFiles.length} sample ideas to test`);
  
  // Test results
  const results: Record<string, { success: boolean, error?: string, deploymentUrls?: Record<string, string> }> = {};
  
  // Run tests for each sample
  for (const sampleFile of sampleFiles) {
    const sampleName = path.basename(sampleFile, '.json');
    logger.info(`Integration test with sample: ${sampleName}`);
    
    try {
      // Load idea input
      const ideaPath = path.join(samplesDir, sampleFile);
      const ideaContent = fs.readFileSync(ideaPath, 'utf8');
      const idea: IdeaInput = JSON.parse(ideaContent);
      
      // Create test-specific working directory
      const testWorkingDir = path.join(outputDir, sampleName);
      fs.ensureDirSync(testWorkingDir);
      
      // Create mock orchestrator
      const orchestrator = new MockOrchestrator(logger);
      
      // Set up event listeners
      orchestrator.on('status_changed', (status) => {
        logger.info(`[${sampleName}] Status changed: ${status}`);
      });
      
      orchestrator.on('progress_update', (update) => {
        logger.info(`[${sampleName}] Progress: ${update.percentage}% - ${update.message}`);
      });
      
      // Start automation process
      logger.info(`[${sampleName}] Starting mock automation process`);
      const result = await orchestrator.start(idea);
      
      // Save result for verification
      const resultFile = path.join(testWorkingDir, 'result.json');
      fs.writeFileSync(resultFile, JSON.stringify(result, null, 2));
      
      results[sampleName] = { 
        success: true,
        deploymentUrls: result.deploymentUrls
      };
      
      logger.info(`[${sampleName}] Integration test completed successfully`);
    } catch (error) {
      logger.error(`[${sampleName}] Integration test failed: ${error}`);
      results[sampleName] = { success: false, error: String(error) };
    }
  }
  
  // Log test summary
  logger.info('Integration test summary:');
  for (const [sampleName, result] of Object.entries(results)) {
    logger.info(`${sampleName}: ${result.success ? 'PASSED' : 'FAILED'}`);
    if (result.success && result.deploymentUrls) {
      logger.info(`  Deployment URLs:`);
      for (const [target, url] of Object.entries(result.deploymentUrls)) {
        logger.info(`    ${target}: ${url}`);
      }
    }
    if (!result.success && result.error) {
      logger.info(`  Error: ${result.error}`);
    }
  }
  
  const passedCount = Object.values(results).filter(r => r.success).length;
  const totalCount = Object.keys(results).length;
  
  logger.info(`Integration tests completed: ${passedCount}/${totalCount} passed`);
  
  // Save overall results
  const summaryFile = path.join(outputDir, 'integration-test-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalTests: totalCount,
    passedTests: passedCount,
    results
  }, null, 2));
  
  logger.info(`Integration test summary saved to ${summaryFile}`);
}

// Run integration tests
runIntegrationTests().catch(error => {
  logger.error(`Unhandled error in integration tests: ${error}`);
  process.exit(1);
});
