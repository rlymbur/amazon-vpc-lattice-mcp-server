import { ErrorCode, McpError, CallToolRequest } from '@modelcontextprotocol/sdk/types.js';

type ToolResponse = {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  _meta?: {
    progressToken?: string | number;
  };
};
import { sources } from './data/sources.js';
import { prompts } from './data/prompts.js';

export const tools = [
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
  },
  {
    name: 'list_amazon_vpc_lattice_prompts',
    description: 'List all available prompt templates',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    },
  },
  {
    name: 'get_amazon_vpc_lattice_prompts',
    description: 'Get details of a specific prompt template',
    inputSchema: {
      type: 'object',
      properties: {
        prompt_name: {
          type: 'string',
          description: 'Name of the prompt template to get'
        }
      },
      required: ['prompt_name'],
      additionalProperties: false
    },
  },
  {
    name: 'vpc_lattice_cli',
    description: 'Execute AWS CLI VPC Lattice commands',
    inputSchema: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The VPC Lattice subcommand to execute (e.g., create-service-network, list-service-networks)',
          enum: [
            'create-service-network',
            'delete-service-network',
            'get-service-network',
            'list-service-networks',
            'update-service-network',
            'create-service',
            'delete-service',
            'get-service',
            'list-services',
            'update-service',
            'create-listener',
            'delete-listener',
            'get-listener',
            'list-listeners',
            'update-listener',
            'create-rule',
            'delete-rule',
            'get-rule',
            'list-rules',
            'update-rule',
            'create-target-group',
            'delete-target-group',
            'get-target-group',
            'list-target-groups',
            'update-target-group',
            'register-targets',
            'deregister-targets',
            'list-targets',
            'list-tags-for-resource',
            'tag-resource',
            'untag-resource'
          ]
        },
        args: {
          type: 'object',
          description: 'Command arguments as key-value pairs',
          additionalProperties: true
        },
        profile: {
          type: 'string',
          description: 'AWS CLI profile to use',
          default: 'default'
        },
        region: {
          type: 'string',
          description: 'AWS region',
          default: 'us-east-1'
        }
      },
      required: ['command'],
      additionalProperties: false
    }
  }
];

export async function handleToolCall(request: CallToolRequest): Promise<ToolResponse> {
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

    case 'list_amazon_vpc_lattice_prompts':
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(prompts.map(p => ({
              name: p.name,
              description: p.description
            })), null, 2)
          }
        ]
      };

    case 'get_amazon_vpc_lattice_prompts': {
      const { prompt_name } = request.params.arguments as { prompt_name: string };
      const prompt = prompts.find(p => p.name === prompt_name);
      
      if (!prompt) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Prompt template not found: ${prompt_name}`
        );
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(prompt, null, 2)
          }
        ]
      };
    }

    case 'vpc_lattice_cli': {
      const { command, args = {}, profile = 'default', region = 'us-east-1' } = request.params.arguments as {
        command: string;
        args?: Record<string, any>;
        profile?: string;
        region?: string;
      };

      // Convert args object to CLI arguments string
      const argsStr = Object.entries(args)
        .map(([key, value]) => {
          const cliKey = key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
          if (typeof value === 'boolean') {
            return value ? `--${cliKey}` : `--no-${cliKey}`;
          }
          if (Array.isArray(value)) {
            return `--${cliKey} ${value.join(',')}`;
          }
          return `--${cliKey} ${value}`;
        })
        .join(' ');

      // Construct and execute the AWS CLI command
      const { spawn } = await import('child_process');
      const awsProcess = spawn('aws', [
        'vpc-lattice',
        command,
        '--profile', profile,
        '--region', region,
        ...(argsStr ? argsStr.split(' ') : []),
        '--output', 'json'
      ]);

      return new Promise((resolve, reject) => {
        let stdout = '';
        let stderr = '';

        awsProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        awsProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        awsProcess.on('close', (code) => {
          if (code !== 0) {
            reject(new McpError(
              ErrorCode.InternalError,
              `AWS CLI command failed: ${stderr}`
            ));
            return;
          }

          try {
            const result = stdout ? JSON.parse(stdout) : {};
            resolve({
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2)
                }
              ]
            });
          } catch (error) {
            reject(new McpError(
              ErrorCode.InternalError,
              `Failed to parse AWS CLI output: ${(error as Error).message}`
            ));
          }
        });

        awsProcess.on('error', (error) => {
          reject(new McpError(
            ErrorCode.InternalError,
            `Failed to execute AWS CLI command: ${(error as Error).message}`
          ));
        });
      });
    }

    default:
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${request.params.name}`
      );
  }
}
