# Configuration Guide

This document provides detailed information about configuring the Cursor Composer Automation solution.

## Configuration File

The configuration file is a JSON file that specifies various settings for the automation process. You can provide this file to both the CLI and service modes.

### Basic Configuration

```json
{
  "cursorPath": "/Applications/Cursor.app/Contents/MacOS/Cursor",
  "workingDirectory": "./output",
  "logLevel": "info",
  "serviceMode": false
}
```

### Full Configuration

```json
{
  "cursorPath": "/Applications/Cursor.app/Contents/MacOS/Cursor",
  "workingDirectory": "./output",
  "deploymentSettings": {
    "targets": ["vercel", "netlify", "aws"],
    "credentials": {
      "vercel": {
        "token": "your-vercel-token"
      },
      "netlify": {
        "token": "your-netlify-token"
      },
      "aws": {
        "accessKeyId": "your-aws-access-key-id",
        "secretAccessKey": "your-aws-secret-access-key",
        "region": "us-west-2"
      }
    },
    "options": {
      "vercel": {
        "scope": "your-team-scope",
        "projectName": "your-project-name"
      },
      "netlify": {
        "site": "your-site-name",
        "team": "your-team-name"
      },
      "aws": {
        "s3Bucket": "your-s3-bucket",
        "cloudFrontDistribution": "your-cloudfront-distribution"
      }
    }
  },
  "logLevel": "debug",
  "serviceMode": true,
  "port": 3000,
  "maxConcurrentJobs": 5,
  "jobTimeout": 3600,
  "retrySettings": {
    "maxRetries": 3,
    "retryDelay": 5000
  }
}
```

## Configuration Options

### Core Settings

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `cursorPath` | string | Path to the Cursor executable | Platform-specific |
| `workingDirectory` | string | Directory for output files | `./output` |
| `logLevel` | string | Logging level (`error`, `warn`, `info`, `debug`) | `info` |
| `serviceMode` | boolean | Whether to run in service mode | `false` |
| `port` | number | Port for service mode | `3000` |

### Deployment Settings

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `deploymentSettings.targets` | string[] | Array of deployment targets | `[]` |
| `deploymentSettings.credentials` | object | Credentials for deployment targets | `{}` |
| `deploymentSettings.options` | object | Options for deployment targets | `{}` |

### Advanced Settings

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `maxConcurrentJobs` | number | Maximum number of concurrent jobs in service mode | `3` |
| `jobTimeout` | number | Timeout for jobs in seconds | `3600` (1 hour) |
| `retrySettings.maxRetries` | number | Maximum number of retries for failed operations | `3` |
| `retrySettings.retryDelay` | number | Delay between retries in milliseconds | `5000` (5 seconds) |

## Platform-Specific Cursor Paths

### macOS

```json
{
  "cursorPath": "/Applications/Cursor.app/Contents/MacOS/Cursor"
}
```

### Windows

```json
{
  "cursorPath": "C:\\Program Files\\Cursor\\Cursor.exe"
}
```

### Linux

```json
{
  "cursorPath": "/usr/bin/cursor"
}
```

## Deployment Target Credentials

### Vercel

```json
{
  "deploymentSettings": {
    "targets": ["vercel"],
    "credentials": {
      "vercel": {
        "token": "your-vercel-token"
      }
    },
    "options": {
      "vercel": {
        "scope": "your-team-scope",
        "projectName": "your-project-name"
      }
    }
  }
}
```

### Netlify

```json
{
  "deploymentSettings": {
    "targets": ["netlify"],
    "credentials": {
      "netlify": {
        "token": "your-netlify-token"
      }
    },
    "options": {
      "netlify": {
        "site": "your-site-name",
        "team": "your-team-name"
      }
    }
  }
}
```

### AWS

```json
{
  "deploymentSettings": {
    "targets": ["aws"],
    "credentials": {
      "aws": {
        "accessKeyId": "your-aws-access-key-id",
        "secretAccessKey": "your-aws-secret-access-key",
        "region": "us-west-2"
      }
    },
    "options": {
      "aws": {
        "s3Bucket": "your-s3-bucket",
        "cloudFrontDistribution": "your-cloudfront-distribution"
      }
    }
  }
}
```

### Multiple Deployment Targets

```json
{
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
    "options": {
      "vercel": {
        "scope": "your-team-scope"
      },
      "netlify": {
        "site": "your-site-name"
      }
    }
  }
}
```

## Environment Variables

Instead of hardcoding sensitive credentials in the configuration file, you can use environment variables:

```json
{
  "deploymentSettings": {
    "targets": ["vercel", "netlify"],
    "credentials": {
      "vercel": {
        "token": "${VERCEL_TOKEN}"
      },
      "netlify": {
        "token": "${NETLIFY_TOKEN}"
      }
    }
  }
}
```

Then set the environment variables:

```bash
export VERCEL_TOKEN=your-vercel-token
export NETLIFY_TOKEN=your-netlify-token
```

## Configuration Precedence

1. Command-line arguments (highest precedence)
2. Environment variables
3. Configuration file
4. Default values (lowest precedence)
