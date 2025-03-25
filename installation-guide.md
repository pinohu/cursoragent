# Installation Guide

This document provides detailed instructions for installing and setting up the Cursor Composer Automation solution.

## Prerequisites

Before installing, ensure you have the following prerequisites:

1. **Node.js and npm**
   - Node.js version 14.x or higher
   - npm version 6.x or higher
   
   You can check your installed versions with:
   ```bash
   node --version
   npm --version
   ```
   
   If you need to install or update Node.js, visit [nodejs.org](https://nodejs.org/).

2. **Cursor Editor**
   - Cursor must be installed on your system
   - Verify the path to your Cursor executable for configuration

3. **System Requirements**
   - Operating System: Windows, macOS, or Linux
   - RAM: 4GB minimum (8GB recommended)
   - Disk Space: 1GB for installation plus space for generated applications

## Installation Methods

### Method 1: Install from npm (Recommended)

Once the package is published to npm, you can install it globally with:

```bash
npm install -g cursor-composer-automation
```

This will make the `cursor-composer-automation` command available system-wide.

### Method 2: Install from Package File

If you have the package file (`.tgz`), you can install it directly:

```bash
npm install -g cursor-composer-automation-1.0.0.tgz
```

### Method 3: Install from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cursor-composer-automation.git
   cd cursor-composer-automation
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Link the package globally:
   ```bash
   npm link
   ```

   Or run the build script which automates the process:
   ```bash
   ./build.sh
   ```

## Configuration

After installation, you'll need to create a configuration file. You can start with the sample configuration:

1. Create a directory for your configuration:
   ```bash
   mkdir -p ~/.cursor-composer-automation
   ```

2. Create a configuration file:
   ```bash
   nano ~/.cursor-composer-automation/config.json
   ```

3. Add your configuration (adjust paths according to your system):
   ```json
   {
     "cursorPath": "/Applications/Cursor.app/Contents/MacOS/Cursor",
     "workingDirectory": "./output",
     "deploymentSettings": {
       "targets": [],
       "credentials": {},
       "options": {}
     },
     "logLevel": "info",
     "serviceMode": false
   }
   ```

4. Save the file

## Deployment Credentials Setup

If you plan to use deployment features, you'll need to set up credentials for the deployment targets:

### Vercel

1. Generate a Vercel token:
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Create a new token
   
2. Add to your configuration:
   ```json
   "deploymentSettings": {
     "targets": ["vercel"],
     "credentials": {
       "vercel": {
         "token": "your-vercel-token"
       }
     }
   }
   ```

### Netlify

1. Generate a Netlify token:
   - Go to [Netlify User Settings](https://app.netlify.com/user/applications)
   - Create a new personal access token
   
2. Add to your configuration:
   ```json
   "deploymentSettings": {
     "targets": ["netlify"],
     "credentials": {
       "netlify": {
         "token": "your-netlify-token"
       }
     }
   }
   ```

## Verification

To verify that the installation was successful:

1. Check the command is available:
   ```bash
   cursor-composer-automation --version
   ```

2. Run a simple test:
   ```bash
   cursor-composer-automation process --idea examples/task_app.json --output ./test_output
   ```

## Troubleshooting Installation Issues

### Command Not Found

If you get a "command not found" error:

1. Ensure the package was installed globally:
   ```bash
   npm list -g cursor-composer-automation
   ```

2. Check your PATH environment variable includes npm global binaries:
   ```bash
   echo $PATH
   ```

3. Try installing with the `-g` flag explicitly:
   ```bash
   npm install -g cursor-composer-automation
   ```

### Permission Issues

If you encounter permission errors during installation:

1. On Linux/macOS, you might need to use sudo:
   ```bash
   sudo npm install -g cursor-composer-automation
   ```

2. Alternatively, fix npm permissions:
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   ```
   
   Then add to your .bashrc or .zshrc:
   ```
   export PATH=~/.npm-global/bin:$PATH
   ```

### Dependency Errors

If you see errors related to dependencies:

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Try installing with the `--verbose` flag to see detailed error messages:
   ```bash
   npm install -g cursor-composer-automation --verbose
   ```

## Next Steps

After installation, refer to the following documentation:

- [Usage Examples](./usage-examples.md) - For examples of how to use the tool
- [Configuration Guide](./configuration-guide.md) - For detailed configuration options
- [API Reference](./api-reference.md) - For programmatic usage
- [Troubleshooting Guide](./troubleshooting.md) - For solving common issues
