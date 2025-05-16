# Amazon VPC Lattice MCP Server

A Model Context Protocol (MCP) server for source listing, providing tools for accessing and managing AWS VPC Lattice resources and related documentation.

## Features

The server provides five main tools:

1. `list_sources`: Lists all available sources with their URLs and sample prompts
2. `get_source_prompts`: Gets sample prompts for a specific source
3. `list_amazon_vpc_lattice_prompts`: Lists all available prompt templates
4. `get_amazon_vpc_lattice_prompts`: Gets details of a specific prompt template
5. `vpc_lattice_cli`: Execute AWS CLI VPC Lattice commands for managing VPC Lattice resources

## Installation

This project is built with TypeScript and uses ES modules. Note that installing [github-mcp-server](https://github.com/github/github-mcp-server) is also strongly recommended to assist with development prompts.

1. Clone the repository:
```bash
git clone https://github.com/awslabs/amazon-vpc-lattice-mcp-server.git
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

The build script will compile the TypeScript code and set the appropriate executable permissions.

## Configuration

Add the server to your MCP settings file (located at `~/Library/Application Support/Code/User/globalStorage/asbx.amzn-cline/settings/cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "amazon-vpc-lattice": {
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

Once configured, you can use the MCP tools in your conversations. Note that you should use `list_amazon_vpc_lattice_prompts` to discover available prompts as these are not automatically discoverable like tools.

### List Sources

```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice",
  tool_name: "list_sources",
  arguments: {}
})
```

### Get Source Prompts

```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice",
  tool_name: "get_source_prompts",
  arguments: {
    source_name: "AWS Documentation"
  }
})
```

### List Amazon VPC Lattice Prompts

```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice",
  tool_name: "list_amazon_vpc_lattice_prompts",
  arguments: {}
})
```

### Get Amazon VPC Lattice Prompt Details

```typescript
use_mcp_tool({
  server_name: "amazon-vpc-lattice",
  tool_name: "get_amazon_vpc_lattice_prompts",
  arguments: {
    prompt_name: "setup_eks_controller"
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
  server_name: "amazon-vpc-lattice",
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
  server_name: "amazon-vpc-lattice",
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
  server_name: "amazon-vpc-lattice",
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
  server_name: "amazon-vpc-lattice",
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

## Available Sources

The server includes these sources:

1. AWS Documentation (docs.aws.amazon.com)
   - Key features queries
   - Configuration guidance
   - Best practices

2. AWS Gateway API Controller for VPC Lattice (aws/aws-application-networking-k8s)
   - Feature support queries
   - Issue tracking

3. Kubernetes Gateway API (gateway-api.sigs.k8s.io)
   - Error resolution
   - Best practices guidance

## Development

### Project Structure

The project is organized as follows:

- `src/index.ts`: Main server setup and initialization
- `src/tools.ts`: Tool definitions and handlers
- `src/data/`: Data files
  - `prompts.ts`: Prompt templates and parameters
  - `sources.ts`: Source definitions and their prompts
- `package.json`: Project configuration and dependencies
- `tsconfig.json`: TypeScript configuration
- `.gitignore`: Git ignore rules
- `build/`: Compiled JavaScript output

### Adding New Sources

To add new sources, modify the `sources` array in `src/data/sources.ts`:

```typescript
export const sources = [
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

To add new prompt templates, modify the `prompts` array in `src/data/prompts.ts`:

```typescript
export const prompts = [
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

- `npm run build`: Build the server and set executable permissions
- `npm run watch`: Watch mode for development
- `npm test`: Run tests (currently not implemented)
