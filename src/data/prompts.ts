export const prompts = [
  {
    name: 'create_github_pr',
    description: 'Create a GitHub pull request from current branch to main',
    template:
        '1. Get the current branch name using "git rev-parse --abbrev-ref HEAD"\n' +
        '2. Push the current branch to remote using "git push -u origin $(git rev-parse --abbrev-ref HEAD)"\n' +
        '3. Use the GitHub MCP server to create a pull request from the current branch to main branch on aws/aws-application-networking-k8s',
    parameters: []
  },
  {
    name: 'setup_eks_controller',
    description: 'Guide for setting up the AWS Application Networking Controller for Kubernetes',
    template: 'Run "make setup" and assist with any resulting errors.',
    parameters: ['cluster_name', 'region', 'k8s_version']
  },
  {
    name: 'run_eks_controller_tests',
    description: 'Run tests for the AWS Application Networking Controller',
    template:
        'Request a test_type from the user. Based on the test_type perform the following tasks. If test_type is unit, ' +
        'run "make test" in the current directory and summarize the results. If test_type is integration, complete the ' +
        'following steps:/n' +
        '1. Kill any processes running in the current terminal and then run "make run".\n' +
        '2. Open a new terminal window and run "make e2e-clean && export FOCUS=$test_focus && export SECONDARY_ACCOUNT_TEST_ROLE_ARN=$secondary_account && make e2e-test" and summarize the results.\n' +
        '3. Return to the original terminal and kill any running processes. If the test_type is not provided, run the steps described for a unit test type first, then the steps described for the integration test type.',
    parameters: ['test_type', 'test_focus', 'secondary_account']
  },
  {
    name: 'eks_controller_issue_solution',
    description: 'Create a solution for an AWS Application Networking Controller GitHub issue',
    template:
        'Create a solution for an AWS Application Networking Controller GitHub issue with the following steps:\n' +
        '1. Request an issue_number from the user. Use the GitHub get_issue tool to understand the issue.\n' +
        '2. Provide a summary of the proposed code changes. Ask the user if they would like to proceed. If they have not chosen to proceed, stop here.\n' +
        '3. Create a new branch locally by running "git checkout -b $branch_name" with an appropriate branch name.\n' +
        '4. Proceed with the code changes using best practices. Ask the user for clarification if required.\n' +
        '5. Ask the user if they would like to create unit tests based on the diff of changes. Append these tests to the existing test file if applicable.\n' +
        '6. Before commiting changes to the local branch, run "source ~/.bashrc && make presubmit" to confirm unit tests pass.',
    parameters: ['issue_number']
  },
  {
    name: 'review_github_pr',
    description: 'Perform a comprehensive code review of a GitHub pull request',
    template:
        'Perform a code review for: {pr_url} by providing specific recommendations for improvements in each of the following areas:\n' +
        '1. Code Quality (Clean and maintainable code, Follows project conventions, No code smells or anti-patterns, Proper error handling, Performance considerations)\n' +
        '2. Testing (Adequate test coverage, Test cases cover edge cases, Integration test considerations, Test documentation)\n' +
        '3. Security (No security vulnerabilities, Secure coding practices, Proper input validation, Authentication/authorization checks)\n' +
        '4. Documentation (Clear inline comments, Updated README/docs, API documentation if applicable, Architecture changes documented)\n' +
        '5. Design (Follows SOLID principles, Appropriate abstractions, Interface consistency, Scalability considerations)\n' +
        '6. Dependencies (Proper version management, No conflicting dependencies, Security of dependencies)',
    parameters: ['pr_url']
  },
  {
    name: 'generate_docs',
    description: 'Generate documentation for code or APIs',
    template: 'Generate documentation for: {code}\n\nInclude:\n- Overview\n- Parameters\n- Return values\n- Example usage',
    parameters: ['code']
  },
  {
    name: 'review_security',
    description: 'Review code or architecture for security concerns',
    template: 'Perform a security review of the code base. Check for vulnerabilities, best practices, and compliance issues',
    parameters: ['target']
  }
];
