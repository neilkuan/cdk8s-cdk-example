const { AwsCdkTypeScriptApp, Semver } = require('projen');

const project = new AwsCdkTypeScriptApp({
  name: "cdk8sXawscdk",
  cdkVersion: '1.67.0',
  authorName: 'Neil Kuan',
  authorEmail: 'guan840912@gmail.com',
  cdkDependencies: [
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-eks',
    '@aws-cdk/aws-s3',
  ],
});

project.addDependencies({
  'cdk8s': Semver.caret('0.30.0'),
  'cdk8s-plus': Semver.caret('0.30.0'),
  'constructs': Semver.caret('3.0.4'),
  'cdk8s-aws-alb-ingress-controller': Semver.caret('0.0.5'),
})
const common_exclude = ['cdk.out', 'cdk.context.json', 'image', 'yarn-error.log','coverage'];
project.gitignore.exclude(...common_exclude);

project.npmignore.exclude(...common_exclude);
project.synth();
