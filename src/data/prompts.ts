export const prompts = [
  {
    name: 'create_github_pr',
    description: 'Create a GitHub pull request from current branch to main',
    template: '1. Get the current branch name using "git rev-parse --abbrev-ref HEAD"\n2. Push the current branch to remote using "git push -u origin $(git rev-parse --abbrev-ref HEAD)"\n3. Use the GitHub MCP server to:\n   - Get the PR template content from PULL_REQUEST_TEMPLATE.md in aws/aws-application-networking-k8s main branch\n   - Create a pull request from the current branch to main branch on aws/aws-application-networking-k8s using the template content',
    parameters: []
  },
  {
    name: 'setup_eks_controller',
    description: 'Guide for setting up the AWS Application Networking Controller for Kubernetes',
    template: 'Help me set up the AWS Application Networking Controller for Kubernetes with these parameters:\n\nCluster Name: {cluster_name}\nAWS Region: {region}\nKubernetes Version: {k8s_version}\n\nProvide:\n- Prerequisites check\n- Installation steps\n- Verification steps\n- Common troubleshooting tips',
    parameters: ['cluster_name', 'region', 'k8s_version']
  },
  {
    name: 'run_eks_controller_tests',
    description: 'Run tests for the AWS Application Networking Controller',
    template: 'Request a test_type from the user. Based on the test_type perform the following tasks. If test_type is unit, run "make test" in the current directory and summarize the results. If test_type is integration, complete the following steps: 1. Kill any processes running in the current terminal and then run "make run". 2. Open a new terminal window and run "make e2e-clean && export FOCUS=$test_focus && make e2e-test" and summarize the results. 3. Return to the original terminal and kill any running processes. If the test_type is not provided, run the steps described for a unit test type first, then the steps described for the integration test type.',
    parameters: ['test_type', 'test_focus']
  },
  {
    name: 'eks_controller_issue_solution',
    description: 'Create a solution for an AWS Application Networking Controller GitHub issue',
    template: '1. Review issue_number and provide a summary of the proposed code changes. Ask the user if they would like to proceed. If they have not chosen to proceed, stop here.\n2. Create a new branch locally for the current repo. Do not use the GitHub MCP server to create this branch remotely.\n3. Proceed with the code changes.\n4. Create unit tests based on the diff of changes.\n5. Use the run_eks_controller_tests prompt from the amazon-vpc-lattice-mcp-server to confirm code changes if required.\n6. Commit the changes to the local branch.',
    parameters: ['issue_number']
  },
  {
    name: 'review_github_pr',
    description: 'Perform a comprehensive code review of a GitHub pull request',
    template: 'Perform a code review for: {pr_url}\n\nReview Checklist:\n\n1. Code Quality\n   - Clean and maintainable code\n   - Follows project conventions\n   - No code smells or anti-patterns\n   - Proper error handling\n   - Performance considerations\n\n2. Testing\n   - Adequate test coverage\n   - Test cases cover edge cases\n   - Integration test considerations\n   - Test documentation\n\n3. Security\n   - No security vulnerabilities\n   - Secure coding practices\n   - Proper input validation\n   - Authentication/authorization checks\n\n4. Documentation\n   - Clear inline comments\n   - Updated README/docs\n   - API documentation if applicable\n   - Architecture changes documented\n\n5. Design\n   - Follows SOLID principles\n   - Appropriate abstractions\n   - Interface consistency\n   - Scalability considerations\n\n6. Dependencies\n   - Proper version management\n   - No conflicting dependencies\n   - Security of dependencies\n\nProvide specific recommendations for improvements in each area.',
    parameters: ['pr_url']
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
