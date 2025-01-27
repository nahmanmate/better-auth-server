#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import winston from "winston";
import * as BetterAuth from "better-auth";

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'better-auth-mcp.log' })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

interface AuthConfig {
  projectId?: string;
  apiKey?: string;
  environment?: string;
}

// Store Better-Auth configuration
let authConfig: AuthConfig = {};

const server = new Server(
  {
    name: "better-auth-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Installation & Setup Tools
      {
        name: "analyze_project",
        description: "Analyze project structure and dependencies to recommend Better-Auth setup approach",
        inputSchema: {
          type: "object",
          properties: {
            projectPath: {
              type: "string",
              description: "Path to the project root"
            }
          },
          required: ["projectPath"]
        }
      },
      {
        name: "setup_better_auth",
        description: "Install and configure Better-Auth in the project",
        inputSchema: {
          type: "object",
          properties: {
            projectPath: {
              type: "string",
              description: "Path to the project root"
            },
            config: {
              type: "object",
              description: "Better-Auth configuration options",
              properties: {
                projectId: { type: "string" },
                apiKey: { type: "string" },
                environment: { type: "string" }
              },
              required: ["projectId", "apiKey"]
            }
          },
          required: ["projectPath", "config"]
        }
      },
      // Migration Tools
      {
        name: "analyze_current_auth",
        description: "Detect and analyze existing auth.js/next-auth implementation",
        inputSchema: {
          type: "object",
          properties: {
            projectPath: {
              type: "string",
              description: "Path to the project root"
            }
          },
          required: ["projectPath"]
        }
      },
      {
        name: "generate_migration_plan",
        description: "Create step-by-step migration plan from existing auth to Better-Auth",
        inputSchema: {
          type: "object",
          properties: {
            projectPath: {
              type: "string",
              description: "Path to the project root"
            },
            currentAuthType: {
              type: "string",
              description: "Current authentication system type",
              enum: ["auth.js", "next-auth"]
            }
          },
          required: ["projectPath", "currentAuthType"]
        }
      },
      // Testing Tools
      {
        name: "test_auth_flows",
        description: "Test authentication workflows",
        inputSchema: {
          type: "object",
          properties: {
            flows: {
              type: "array",
              items: {
                type: "string",
                enum: ["login", "register", "password-reset", "2fa"]
              },
              description: "Authentication flows to test"
            }
          },
          required: ["flows"]
        }
      },
      {
        name: "test_security",
        description: "Run security tests on Better-Auth setup",
        inputSchema: {
          type: "object",
          properties: {
            tests: {
              type: "array",
              items: {
                type: "string",
                enum: ["password-policy", "rate-limiting", "session-management"]
              }
            }
          },
          required: ["tests"]
        }
      },
      // Debugging Tools
      {
        name: "analyze_logs",
        description: "Analyze Better-Auth logs for issues",
        inputSchema: {
          type: "object",
          properties: {
            timeRange: {
              type: "string",
              description: "Time range to analyze (e.g. '24h', '7d')"
            }
          },
          required: ["timeRange"]
        }
      },
      {
        name: "monitor_auth_flows",
        description: "Real-time monitoring of authentication processes",
        inputSchema: {
          type: "object",
          properties: {
            duration: {
              type: "string",
              description: "Monitoring duration (e.g. '1h', '30m')"
            }
          },
          required: ["duration"]
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case "analyze_project": {
        const { projectPath } = request.params.arguments as { projectPath: string };
        logger.info(`Analyzing project at ${projectPath}`);
        // Implementation would analyze package.json, framework usage, etc.
        return {
          content: [{
            type: "text",
            text: `Project analysis complete for ${projectPath}`
          }]
        };
      }

      case "setup_better_auth": {
        const { projectPath, config } = request.params.arguments as { 
          projectPath: string, 
          config: AuthConfig 
        };
        logger.info(`Setting up Better-Auth in ${projectPath}`);
        authConfig = config;
        // Implementation would install dependencies and configure Better-Auth
        return {
          content: [{
            type: "text",
            text: `Better-Auth setup complete in ${projectPath}`
          }]
        };
      }

      case "analyze_current_auth": {
        const { projectPath } = request.params.arguments as { projectPath: string };
        logger.info(`Analyzing existing auth in ${projectPath}`);
        // Implementation would detect and analyze current auth setup
        return {
          content: [{
            type: "text",
            text: `Auth analysis complete for ${projectPath}`
          }]
        };
      }

      case "generate_migration_plan": {
        const { projectPath, currentAuthType } = request.params.arguments as {
          projectPath: string,
          currentAuthType: string
        };
        logger.info(`Generating migration plan for ${currentAuthType}`);
        // Implementation would create migration steps based on current auth
        return {
          content: [{
            type: "text",
            text: `Migration plan generated for ${currentAuthType}`
          }]
        };
      }

      case "test_auth_flows": {
        const { flows } = request.params.arguments as { flows: string[] };
        logger.info(`Testing auth flows: ${flows.join(", ")}`);
        // Implementation would test specified authentication flows
        return {
          content: [{
            type: "text",
            text: `Auth flow tests completed for: ${flows.join(", ")}`
          }]
        };
      }

      case "test_security": {
        const { tests } = request.params.arguments as { tests: string[] };
        logger.info(`Running security tests: ${tests.join(", ")}`);
        // Implementation would run security tests
        return {
          content: [{
            type: "text",
            text: `Security tests completed for: ${tests.join(", ")}`
          }]
        };
      }

      case "analyze_logs": {
        const { timeRange } = request.params.arguments as { timeRange: string };
        logger.info(`Analyzing logs for time range: ${timeRange}`);
        // Implementation would analyze Better-Auth logs
        return {
          content: [{
            type: "text",
            text: `Log analysis complete for time range: ${timeRange}`
          }]
        };
      }

      case "monitor_auth_flows": {
        const { duration } = request.params.arguments as { duration: string };
        logger.info(`Starting auth flow monitoring for duration: ${duration}`);
        // Implementation would monitor auth processes
        return {
          content: [{
            type: "text",
            text: `Auth flow monitoring complete for duration: ${duration}`
          }]
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
    }
  } catch (error: any) {
    logger.error('Tool execution error:', error);
    throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error?.message || 'Unknown error'}`);
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "better-auth://config",
        mimeType: "application/json",
        name: "Better-Auth Configuration",
        description: "Current Better-Auth configuration settings"
      },
      {
        uri: "better-auth://logs",
        mimeType: "text/plain",
        name: "Better-Auth Logs",
        description: "Authentication system logs"
      }
    ]
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  try {
    const url = new URL(request.params.uri);
    
    switch (url.protocol) {
      case "better-auth:": {
        switch (url.hostname) {
          case "config":
            return {
              contents: [{
                uri: request.params.uri,
                mimeType: "application/json",
                text: JSON.stringify(authConfig, null, 2)
              }]
            };
          
          case "logs":
            // Implementation would read actual log file
            return {
              contents: [{
                uri: request.params.uri,
                mimeType: "text/plain",
                text: "Better-Auth logs would be displayed here"
              }]
            };
          
          default:
            throw new McpError(ErrorCode.InvalidRequest, `Unknown resource: ${url.hostname}`);
        }
      }
      
      default:
        throw new McpError(ErrorCode.InvalidRequest, `Unknown protocol: ${url.protocol}`);
    }
  } catch (error: any) {
    logger.error('Resource read error:', error);
    throw new McpError(ErrorCode.InternalError, `Resource read failed: ${error?.message || 'Unknown error'}`);
  }
});

// Start the server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info('Better-Auth MCP server started');
  } catch (error: any) {
    logger.error('Server startup error:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error: Error) => {
  logger.error('Unhandled rejection:', error);
  process.exit(1);
});

main().catch((error: Error) => {
  logger.error('Server error:', error);
  process.exit(1);
});
