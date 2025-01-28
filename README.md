# better-auth-mcp-server MCP Server

MCP Server for Authentication Management

Enterprise-grade authentication solution providing:

- 🔐 Secure credential management with AES-256 encryption
- ⚙️ Multi-protocol auth (OAuth2, SAML, LDAP)
- 🛡️ Real-time threat detection and prevention

<a href="https://glama.ai/mcp/servers/7f1irpro2i"><img width="380" height="200" src="https://glama.ai/mcp/servers/7f1irpro2i/badge" alt="Better Auth Server MCP server" /></a>

## Features

### Core Tools
- `analyze_project` - Analyze project structure for auth setup recommendations
- `setup_better_auth` - Configure auth providers with project ID and API key
- `analyze_current_auth` - Detect existing auth.js/next-auth implementations
- `generate_migration_plan` - Create step-by-step migration path

### Testing & Security
- `test_auth_flows` - Validate login/register/reset/2fa flows
- `test_security` - Run OWASP-aligned security checks
- `analyze_logs` - Review auth system logs for issues
- `monitor_auth_flows` - Real-time authentication monitoring

### Available Resources
- `better-auth://config` - Current Better-Auth configuration settings
- `better-auth://logs` - Authentication system logs

## Development

Clone and install:
```bash
git clone https://github.com/better-auth-mcp-server/better-auth-mcp-server.git
cd better-auth-mcp-server
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Configuration

### Environment Variables
```ini
# Required
BETTER_AUTH_PROJECT_ID=your-project-id
BETTER_AUTH_API_KEY=your-api-key

# Optional
BETTER_AUTH_ENV=development|staging|production
LOG_LEVEL=info|debug|error
```

### Security Best Practices

1. API Key Management
   - Store API keys in environment variables
   - Rotate keys regularly
   - Use different keys per environment

2. Access Control
   - Implement rate limiting
   - Configure IP allowlists
   - Use principle of least privilege

3. Monitoring
   - Enable audit logging
   - Monitor auth failures
   - Set up alerts for suspicious activity

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "better-auth-mcp-server": {
      "command": "node",
      "args": ["/path/to/better-auth-mcp-server/build/index.js"],
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

## Usage Examples

### Project Setup
```typescript
// Initialize Better-Auth in your project
await mcp.useTool('setup_better_auth', {
  projectPath: './my-next-app',
  config: {
    projectId: process.env.BETTER_AUTH_PROJECT_ID,
    apiKey: process.env.BETTER_AUTH_API_KEY
  }
});

// Test core authentication flows
await mcp.useTool('test_auth_flows', {
  flows: ['login', 'register', '2fa']
});
```

### Migration from Auth.js/NextAuth
```typescript
// Analyze current auth implementation
await mcp.useTool('analyze_current_auth', {
  projectPath: './my-next-app'
});

// Generate migration steps
await mcp.useTool('generate_migration_plan', {
  projectPath: './my-next-app',
  currentAuthType: 'next-auth'
});
