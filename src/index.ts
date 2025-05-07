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

// Prompt templates
const prompts = [
  {
    name: 'setup_eks_controller',
    description: 'Guide for setting up the AWS Application Networking Controller for Kubernetes',
    template: 'Help me set up the AWS Application Networking Controller for Kubernetes with these parameters:\n\nCluster Name: {cluster_name}\nAWS Region: {region}\nKubernetes Version: {k8s_version}\n\nProvide:\n- Prerequisites check\n- Installation steps\n- Verification steps\n- Common troubleshooting tips',
    parameters: ['cluster_name', 'region', 'k8s_version']
  },
  {
    name: 'run_eks_controller_tests',
    description: 'Run unit and integration tests for the AWS Application Networking Controller',
    template: 'Run tests for the AWS Application Networking Controller with these parameters:\n\nTest Type: {test_type} (unit|integration)\nTest Suite: {test_suite}\nTest Filter: {test_filter}\nVerbosity Level: {verbosity}\n\nProvide steps based on test type:\n\nFor Unit Tests:\n- Test environment setup\n- Test execution steps (make test)\n- Test results analysis\n- Coverage report summary\n- Debugging tips for failed tests\n\nFor Integration Tests:\n1. Controller Management:\n   - Check and kill any existing controller process\n   - Start new controller with "make run" in a separate terminal\n\n2. Test Execution:\n   - Run "make e2e-clean" to clean up any previous test artifacts\n   - Run "make e2e-tests" in a separate terminal\n   - Monitor test progress\n   - Analyze test results\n\n3. Cleanup:\n   - Proper shutdown of controller process\n   - Collection of logs and artifacts',
    parameters: ['test_type', 'test_suite', 'test_filter', 'verbosity']
  },
  {
    name: 'eks_controller_issue_solution',
    description: 'Create a solution for an AWS Application Networking Controller GitHub issue',
    template: 'Create a solution for GitHub issue #{issue_number} with these parameters:\n\nIssue: {issue_number}\nBranch Name: {branch_name}\n\nFollow these steps:\n\n1. Development Setup:\n   - Create new branch from main: git checkout -b {branch_name}\n   - Review issue requirements and acceptance criteria\n\n2. Implementation:\n   - Make necessary code changes\n   - Follow project coding standards and patterns\n   - Add comments explaining complex logic\n\n3. Testing:\n   - Add unit tests covering the changes\n   - Update existing tests if needed\n   - Run unit tests to verify: make test\n   - Run "make presubmit" to ensure all checks pass\n\n4. Documentation:\n   - Update relevant documentation\n   - Add inline code comments where needed\n   - Document any new configuration options\n\n5. Pull Request:\n   - Create draft PR using existing template\n   - Include:\n     * Issue reference: #{issue_number}\n     * Description of changes\n     * Testing performed\n     * Documentation updates\n   - Add labels: "in-progress", appropriate component tags\n   - Request reviewers based on code ownership\n\n6. Verification:\n   - Review PR diff for unintended changes\n   - Ensure all CI checks pass\n   - Self-review against PR checklist\n   - Address any initial feedback',
    parameters: ['issue_number', 'branch_name']
  },
  {
    name: 'review_code',
    description: 'Review code changes and provide feedback',
    template: 'Review this code change:\n\n{code}\n\nProvide feedback on:\n- Code quality\n- Best practices\n- Potential issues\n- Suggestions for improvement',
    parameters: ['code']
  },
  {
    name: 'bug_analysis',
    description: 'Analyze error messages and suggest fixes',
    template: 'Error message: {error}\n\nContext: {context}\n\nAnalyze the error and suggest potential fixes.',
    parameters: ['error', 'context']
  },
  {
    name: 'review_architecture',
    description: 'Review system architecture and provide recommendations',
    template: 'Review this system architecture:\n\n{design}\n\nConsider:\n- Scalability\n- Reliability\n- Security\n- Cost optimization',
    parameters: ['design']
  },
  {
    name: 'generate_docs',
    description: 'Generate documentation for code or APIs',
    template: 'Generate documentation for:\n\n{code}\n\nInclude:\n- Overview\n- Parameters\n- Return values\n- Example usage',
    parameters: ['code']
  },
  {
    name: 'review_security',
    description: 'Review code or architecture for security concerns',
    template: 'Perform a security review of:\n\n{target}\n\nCheck for:\n- Vulnerabilities\n- Best practices\n- Compliance issues',
    parameters: ['target']
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
        },
        {
          name: 'list_prompts',
          description: 'List all available prompt templates',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false
          },
        },
        {
          name: 'get_prompts',
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

        case 'list_prompts':
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

        case 'get_prompts': {
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
                return `--${cliKey} ${value.map(v => JSON.stringify(v)).join(',')}`;
              }
              return `--${cliKey} ${JSON.stringify(value)}`;
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
