export const prompts = [
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
