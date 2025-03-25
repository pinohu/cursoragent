#!/bin/bash

# Build script for Cursor Composer Automation

# Ensure we're in the project root
cd "$(dirname "$0")"

# Clean previous build
echo "Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "Installing dependencies..."
npm install

# Build TypeScript
echo "Building TypeScript..."
npm run build

# Copy documentation
echo "Copying documentation..."
mkdir -p dist/docs
cp -r docs/* dist/docs/

# Copy example files
echo "Copying example files..."
mkdir -p dist/examples
cp -r tests/sample_ideas/* dist/examples/

# Create sample configuration
echo "Creating sample configuration..."
mkdir -p dist/config
cat > dist/config/sample-config.json << EOL
{
  "cursorPath": "/Applications/Cursor.app/Contents/MacOS/Cursor",
  "workingDirectory": "./output",
  "deploymentSettings": {
    "targets": ["vercel", "netlify"],
    "credentials": {
      "vercel": {
        "token": "your-vercel-token"
      },
      "netlify": {
        "token": "your-netlify-token"
      }
    },
    "options": {}
  },
  "logLevel": "info",
  "serviceMode": false
}
EOL

# Make CLI executable
echo "Making CLI executable..."
chmod +x dist/cli.js

# Create package
echo "Creating package..."
npm pack

echo "Build completed successfully!"
echo "You can now install the package globally with: npm install -g cursor-composer-automation-1.0.0.tgz"
