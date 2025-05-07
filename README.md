# Amazon VPC Lattice MCP Server

A Model Context Protocol (MCP) server that provides tools for accessing and managing source information.

## Features

The server provides five main tools:

1. `list_sources`: Lists all available sources with their URLs
2. `get_source_prompts`: Gets sample prompts for a specific source
3. `list_prompts`: Lists all available prompt templates
4. `get_prompts`: Gets details of a specific prompt template
5. `vpc_lattice_cli`: Execute AWS CLI VPC Lattice commands for managing VPC Lattice resources

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/amazon-vpc-lattice-mcp-server.git
cd amazon-vpc-lattice-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the server:
```bash
npm run build
```

## Configuration

Add the server to your MCP settings file (located at `~/Library/Application Support/Code/User/globalStorage/asbx.amzn-cline/settings/cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "amazon-vpc-lattice-mcp": {
      "command": "node",
      "args": ["/path/to/amazon-vpc-lattice-mcp-server/build/index.js"],
      "disabled": false,
      "autoApprove": [],
      "env": {}
    }
  }
}
```

## Usage

Once configured, you can use the MCP tools in your conversations:

### List Sources

```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice-mcp",
  tool_name: "list_sources",
  arguments: {}
})
```

### Get Source Prompts

```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice-mcp",
  tool_name: "get_source_prompts",
  arguments: {
    source_name: "AWS Documentation"
  }
})
```

### List Prompts

```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice-mcp",
  tool_name: "list_prompts",
  arguments: {}
})
```

### Get Prompt Details

```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice-mcp",
  tool_name: "get_prompts",
  arguments: {
    prompt_name: "EKS Controller Setup"
  }
})
```

### VPC Lattice CLI

The `vpc_lattice_cli` tool provides a programmatic interface to AWS VPC Lattice operations through the AWS CLI.

#### Features
- Supports all major VPC Lattice CLI operations
- Accepts command arguments as JavaScript objects
- Automatically converts camelCase parameters to CLI-style kebab-case
- Handles boolean flags, arrays, and complex values
- Supports AWS profiles and region configuration
- Returns parsed JSON responses

#### Available Commands
- Service Network: create-service-network, delete-service-network, get-service-network, list-service-networks, update-service-network
- Service: create-service, delete-service, get-service, list-services, update-service
- Listener: create-listener, delete-listener, get-listener, list-listeners, update-listener
- Rule: create-rule, delete-rule, get-rule, list-rules, update-rule
- Target Group: create-target-group, delete-target-group, get-target-group, list-target-groups, update-target-group
- Target Management: register-targets, deregister-targets, list-targets
- Resource Tags: list-tags-for-resource, tag-resource, untag-resource

#### Examples

List service networks:
```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice-mcp",
  tool_name: "vpc_lattice_cli",
  arguments: {
    command: "list-service-networks",
    region: "us-west-2"
  }
})
```

Create a service network:
```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice-mcp",
  tool_name: "vpc_lattice_cli",
  arguments: {
    command: "create-service-network",
    args: {
      name: "my-network",
      authType: "NONE"
    }
  }
})
```

Create a service with tags:
```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice-mcp",
  tool_name: "vpc_lattice_cli",
  arguments: {
    command: "create-service",
    args: {
      name: "my-service",
      serviceNetworkIdentifier: "sn-12345",
      tags: [
        { key: "Environment", value: "Production" }
      ]
    }
  }
})
```

Create a target group:
```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice-mcp",
  tool_name: "vpc_lattice_cli",
  arguments: {
    command: "create-target-group",
    args: {
      name: "my-target-group",
      type: "INSTANCE",
      config: {
        port: 80,
        protocol: "HTTP",
        healthCheck: {
          enabled: true,
          protocol: "HTTP",
          path: "/health"
        }
      }
    }
  }
})
```

Register targets:
```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice-mcp",
  tool_name: "vpc_lattice_cli",
  arguments: {
    command: "register-targets",
    args: {
      targetGroupIdentifier: "tg-12345",
      targets: [
        { id: "i-1234567890abcdef0", port: 80 }
      ]
    }
  }
})
```

## Available Sources

The server includes these sources:

1. AWS Documentation (docs.aws.amazon.com)
2. GitHub Repo for AWS Gateway API Controller for VPC Lattice (aws/aws-application-networking-k8s)
3. Kubernetes Gateway API (gateway-api.sigs.k8s.io)

## Development

### Project Structure

- `src/index.ts`: Main server implementation
- `package.json`: Project configuration and dependencies
- `tsconfig.json`: TypeScript configuration
- `.gitignore`: Git ignore rules

## Available Prompts

The server includes these prompt templates:

1. EKS Controller Setup
   - Guide for setting up the AWS Application Networking Controller for Kubernetes
   - Parameters: cluster_name, region, k8s_version

2. EKS Controller Tests
   - Run unit and integration tests for the AWS Application Networking Controller
   - Parameters: test_type, test_suite, test_filter, verbosity
   - Supports both unit tests and integration tests with e2e-clean

3. EKS Controller Issue Solution
   - Create solutions for GitHub issues with proper testing and PR creation
   - Parameters: issue_number, branch_name
   - Includes presubmit checks and draft PR creation

4. Code Review
   - Review code changes and provide feedback
   - Parameters: code

5. Bug Analysis
   - Analyze error messages and suggest fixes
   - Parameters: error, context

6. Architecture Review
   - Review system architecture and provide recommendations
   - Parameters: design

7. Documentation Generator
   - Generate documentation for code or APIs
   - Parameters: code

8. Security Review
   - Review code or architecture for security concerns
   - Parameters: target

### Adding New Sources

To add new sources, modify the `sources` array in `src/index.ts`:

```typescript
const sources = [
  {
    name: 'Your Source',
    url: 'https://your-source-url.com',
    prompts: [
      'Sample prompt 1 {placeholder}',
      'Sample prompt 2 {placeholder}'
    ]
  }
  // ... existing sources
];
```

### Adding New Prompts

To add new prompt templates, modify the `prompts` array in `src/index.ts`:

```typescript
const prompts = [
  {
    name: 'Your Prompt Template',
    description: 'Description of what the prompt does',
    template: 'Your prompt template with {parameter} placeholders',
    parameters: ['parameter']
  }
  // ... existing prompts
];
```

### Scripts

- `npm run build`: Build the server
- `npm run watch`: Watch mode for development

## License

[Add your license information here]
