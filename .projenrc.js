const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  name: "cdk8sXawscdk",
  cdkVersion: '1.82.0',
  authorName: 'Neil Kuan',
  authorEmail: 'guan840912@gmail.com',
  cdkDependencies: [
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-eks',
    '@aws-cdk/aws-s3',
  ],
  dependabot: false,
  deps: [
  'cdk8s@^0.33.0',
  'cdk8s-plus@^0.33.0',
  'constructs',
  'cdk8s-aws-alb-ingress-controller@^1.0.0',
  'cdk8s-external-dns'
  ],
});

const common_exclude = ['cdk.out', 'cdk.context.json', 'image', 'yarn-error.log','coverage'];
project.gitignore.exclude(...common_exclude);

project.npmignore.exclude(...common_exclude);
project.synth();
