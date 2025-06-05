export const sources = [
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
    name: 'AWS VPC Lattice CLI Command Reference',
    url: 'https://docs.aws.amazon.com/cli/latest/reference/vpc-lattice/',
    prompts: [
      'Which functions are most similar of {function}?',
      'What parameters do I need to include for {function}',
      'Am I syntactically correct for AWS CLI to use {function}'
      
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
