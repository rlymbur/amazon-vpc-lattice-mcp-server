export const prompts = [
  {
    name: 'setup_eks_controller',
    description: 'Guide for setting up the AWS Application Networking Controller for Kubernetes',
    template: 'Help me set up the AWS Application Networking Controller for Kubernetes with these parameters:\n\nCluster Name: {cluster_name}\nAWS Region: {region}\nKubernetes Version: {k8s_version}\n\nProvide:\n- Prerequisites check\n- Installation steps\n- Verification steps\n- Common troubleshooting tips',
    parameters: ['cluster_name', 'region', 'k8s_version']
  },
  {
    name: 'run_eks_controller_tests',
    description: 'Run tests for the AWS Application Networking Controller',
    template: 'Based on the test_type perform the following tasks. If test_type is unit, run "make test" in the current directory and summarize the results. If test_type is integration, complete the following steps: 1. Kill any processes running in the current terminal and then run "make run". 2. Open a new terminal window and run "make e2e-clean && make e2e-test" and summarize the results. 3. Return to the original terminal and kill any running processes. If the test_type is not provided, run the steps described for a unit test type first, then the steps described for the integration test type.',
    parameters: ['test_type']
  },
  {
    name: 'eks_controller_issue_solution',
    description: 'Create a solution for an AWS Application Networking Controller GitHub issue',
    template: 'Create a solution for GitHub issue #{issue_number} with these parameters:\n\nIssue: {issue_number}\nBranch Name: {branch_name}\n\nFollow these steps:\n\n1. Development Setup:\n   - Create new branch from main: git checkout -b {branch_name}\n   - Review issue requirements and acceptance criteria\n\n2. Implementation:\n   - Make necessary code changes\n   - Follow project coding standards and patterns\n   - Add comments explaining complex logic\n\n3. Testing:\n   - Add unit tests covering the changes\n   - Update existing tests if needed\n   - Run unit tests to verify: make test\n   - Run "make presubmit" to ensure all checks pass\n\n4. Documentation:\n   - Update relevant documentation\n   - Add inline code comments where needed\n   - Document any new configuration options\n\n5. Pull Request:\n   - Create draft PR using existing template\n   - Include:\n     * Issue reference: #{issue_number}\n     * Description of changes\n     * Testing performed\n     * Documentation updates\n   - Add labels: "in-progress", appropriate component tags\n   - Request reviewers based on code ownership\n\n6. Verification:\n   - Review PR diff for unintended changes\n   - Ensure all CI checks pass\n   - Self-review against PR checklist\n   - Address any initial feedback',
    parameters: ['issue_number', 'branch_name']
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
