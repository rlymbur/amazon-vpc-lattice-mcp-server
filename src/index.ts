#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Hardcoded sources with their prompts
const sources = [
  {
    name: 'AWS Documentation',
    url: 'https://docs.aws.amazon.com',
    prompts: [
      'What are the key features of {service}?',
      'How do I configure {service} for {use_case}?',
      'What are the best practices for using {service}?'
    ]
  },
  {
    name: 'AWS Gateway API Controller for VPC Lattice',
    url: 'https://github.com/aws/aws-application-networking-k8s',
    prompts: [
      'Does the EKS controller support {feature}',
      'Show me {type} issues in the EKS controller repo'
    ]
  },
  {
    name: 'Kubernetes Gateway API',
    url: 'https://gateway-api.sigs.k8s.io/',
    prompts: [
      'Fix error: {error_message}',
      'Best practices for {resource}'
    ]
  }
];

class SourceListServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'amazon-vpc-lattice-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_sources',
          description: 'List all available sources with their URLs and sample prompts',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false
          },
        },
        {
          name: 'get_source_prompts',
          description: 'Get sample prompts for a specific source',
          inputSchema: {
            type: 'object',
            properties: {
              source_name: {
                type: 'string',
                description: 'Name of the source to get prompts for'
              }
            },
            required: ['source_name'],
            additionalProperties: false
          },
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'list_sources':
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(sources.map(s => ({
                  name: s.name,
                  url: s.url
                })), null, 2)
              }
            ]
          };

        case 'get_source_prompts': {
          const { source_name } = request.params.arguments as { source_name: string };
          const source = sources.find(s => s.name === source_name);
          
          if (!source) {
            throw new McpError(
              ErrorCode.InvalidParams,
              `Source not found: ${source_name}`
            );
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(source.prompts, null, 2)
              }
            ]
          };
        }

        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Amazon VPC Lattice MCP server running on stdio');
  }
}

const server = new SourceListServer();
server.run().catch(console.error);
