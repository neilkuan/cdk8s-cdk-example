const { AwsCdkTypeScriptApp, DependenciesUpgradeMechanism } = require('projen');

const project = new AwsCdkTypeScriptApp({
  name: 'cdk8sXawscdk',
  cdkVersion: '1.114.0',
  authorName: 'Neil Kuan',
  authorEmail: 'guan840912@gmail.com',
  defaultReleaseBranch: 'main',
  release: false,
  repository: 'https://github.com/neilkuan/cdk8s-cdk-example.git',
  cdkDependencies: [
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-eks',
  ],
  deps: [
    'cdk8s',
    'constructs',
    'cdk8s-aws-load-balancer-controller',
    'cdk8s-external-dns',
  ],
  depsUpgrade: DependenciesUpgradeMechanism.githubWorkflow({
    workflowOptions: {
      labels: ['auto-approve'],
      secret: 'AUTOMATION_GITHUB_TOKEN',
    },
  }),
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['neilkuan'],
  },
});

const common_exclude = ['cdk.out', 'cdk.context.json', 'image', 'yarn-error.log', 'coverage'];
project.gitignore.exclude(...common_exclude);

project.npmignore.exclude(...common_exclude);
project.synth();
