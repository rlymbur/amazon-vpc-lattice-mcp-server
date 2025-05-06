# Amazon VPC Lattice MCP Server

A Model Context Protocol (MCP) server that provides tools for accessing and managing source information.

## Features

The server provides two main tools:

1. `list_sources`: Lists all available sources with their URLs
2. `get_source_prompts`: Gets sample prompts for a specific source

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

### Scripts

- `npm run build`: Build the server
- `npm run watch`: Watch mode for development

## License

[Add your license information here]
