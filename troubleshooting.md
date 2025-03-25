# Troubleshooting Guide

This document provides solutions for common issues you might encounter when using the Cursor Composer Automation solution.

## Installation Issues

### Package Installation Fails

**Problem**: Error when installing the package via npm.

**Solution**:
1. Ensure you have Node.js 14.x or higher installed:
   ```bash
   node --version
   ```

2. Try clearing npm cache:
   ```bash
   npm cache clean --force
   ```

3. Install with verbose logging:
   ```bash
   npm install -g cursor-composer-automation --verbose
   ```

### Missing Dependencies

**Problem**: Error about missing dependencies when running the tool.

**Solution**:
1. Ensure all dependencies are installed:
   ```bash
   cd cursor-composer-automation
   npm install
   ```

2. For native dependencies, ensure you have build tools installed:
   - **Linux**: `sudo apt-get install build-essential libxtst-dev libpng++-dev`
   - **macOS**: `xcode-select --install`
   - **Windows**: Install Visual Studio Build Tools

## Cursor Interaction Issues

### Cursor Not Found

**Problem**: Error "Cursor executable not found" when running the automation.

**Solution**:
1. Verify Cursor is installed on your system
2. Provide the correct path to Cursor in your configuration:
   ```json
   {
     "cursorPath": "/correct/path/to/Cursor"
   }
   ```
3. Common paths:
   - macOS: `/Applications/Cursor.app/Contents/MacOS/Cursor`
   - Windows: `C:\\Program Files\\Cursor\\Cursor.exe`
   - Linux: `/usr/bin/cursor`

### Cursor Crashes During Automation

**Problem**: Cursor application crashes during the automation process.

**Solution**:
1. Ensure you have the latest version of Cursor installed
2. Check system resources (memory, disk space)
3. Try running with fewer concurrent jobs:
   ```json
   {
     "maxConcurrentJobs": 1
   }
   ```
4. Increase timeout settings:
   ```json
   {
     "jobTimeout": 7200
   }
   ```

### Composer Not Responding

**Problem**: Cursor Composer appears to be stuck or not responding.

**Solution**:
1. Increase the timeout settings in your configuration:
   ```json
   {
     "retrySettings": {
       "maxRetries": 5,
       "retryDelay": 10000
     }
   }
   ```
2. Check if your idea input is too complex; try simplifying it
3. Ensure Cursor has sufficient system resources

## Deployment Issues

### Authentication Failures

**Problem**: Deployment fails with authentication errors.

**Solution**:
1. Verify your credentials in the configuration file:
   ```json
   {
     "deploymentSettings": {
       "credentials": {
         "vercel": {
           "token": "your-correct-token"
         }
       }
     }
   }
   ```
2. Ensure tokens have not expired
3. Check that your tokens have the necessary permissions
4. For environment variables, ensure they are correctly set:
   ```bash
   export VERCEL_TOKEN=your-token
   ```

### Deployment Timeouts

**Problem**: Deployment process times out.

**Solution**:
1. Increase the job timeout in your configuration:
   ```json
   {
     "jobTimeout": 7200
   }
   ```
2. Check your internet connection
3. Verify the deployment service status
4. For large applications, try optimizing the build process

### Unsupported Framework

**Problem**: Error about unsupported framework during deployment.

**Solution**:
1. Check if the framework is supported by the deployment target
2. Ensure the correct build commands are being used
3. Try a different deployment target that supports your framework
4. Add custom build configuration if needed

## Service Mode Issues

### Service Won't Start

**Problem**: The automation service fails to start.

**Solution**:
1. Check if the port is already in use:
   ```bash
   lsof -i :3000
   ```
2. Try a different port:
   ```bash
   cursor-composer-automation service --port 3001
   ```
3. Ensure you have the necessary permissions
4. Check the logs for specific errors

### Jobs Stuck in Queue

**Problem**: Jobs remain in the queue and don't start processing.

**Solution**:
1. Check if the maximum concurrent jobs limit is reached:
   ```json
   {
     "maxConcurrentJobs": 5
   }
   ```
2. Restart the service
3. Check system resources
4. Look for errors in the logs

## File System Issues

### Permission Denied

**Problem**: File system operations fail with "Permission denied" errors.

**Solution**:
1. Ensure the working directory is writable:
   ```bash
   chmod -R 755 ./output
   ```
2. Run the tool with appropriate permissions
3. Check if antivirus software is blocking operations
4. Use a different working directory

### Disk Space Issues

**Problem**: Operations fail due to insufficient disk space.

**Solution**:
1. Free up disk space
2. Use a different working directory with more space:
   ```json
   {
     "workingDirectory": "/path/with/more/space"
   }
   ```
3. Clean up old output directories

## Logging and Debugging

### Enabling Debug Logs

To get more detailed logs for troubleshooting:

1. Set log level to debug in configuration:
   ```json
   {
     "logLevel": "debug"
   }
   ```

2. Or use the verbose flag with CLI:
   ```bash
   cursor-composer-automation process --idea example.json --verbose
   ```

### Checking Log Files

Log files are stored in:
- `error.log`: Contains error messages
- `combined.log`: Contains all log messages

Review these files for detailed information about issues.

### Reporting Issues

When reporting issues, please include:
1. The command or API call you were using
2. Your configuration file (with sensitive information removed)
3. The error message and stack trace
4. Log files
5. System information (OS, Node.js version, Cursor version)

## Common Error Messages

### "Error: ENOENT: no such file or directory"

**Cause**: The specified file or directory does not exist.

**Solution**: Check the path and ensure the file or directory exists.

### "Error: Cannot find module"

**Cause**: A required module is missing.

**Solution**: Run `npm install` to install dependencies.

### "Error: Cursor process exited with code 1"

**Cause**: Cursor crashed or encountered an error.

**Solution**: Check Cursor logs and ensure it's properly installed.

### "Error: Deployment failed: Invalid token"

**Cause**: Authentication token is invalid or expired.

**Solution**: Update your deployment credentials.

### "Error: Timeout waiting for Composer to complete"

**Cause**: Composer is taking too long to generate the application.

**Solution**: Increase timeout settings or simplify your idea input.
