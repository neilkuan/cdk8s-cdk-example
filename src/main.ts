import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import * as cdk8s from 'cdk8s';
import { MyChart } from './mycdk8s';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

// new stack
const stack = new Stack(app, 'EKSstack', {
  env: devEnv,
});
const iampolicy = new iam.PolicyStatement({
  actions: [
    'acm:DescribeCertificate',
    'acm:ListCertificates',
    'acm:GetCertificate',
    'ec2:AuthorizeSecurityGroupIngress',
    'ec2:CreateSecurityGroup',
    'ec2:CreateTags',
    'ec2:DeleteTags',
    'ec2:DeleteSecurityGroup',
    'ec2:DescribeAccountAttributes',
    'ec2:DescribeAddresses',
    'ec2:DescribeInstances',
    'ec2:DescribeInstanceStatus',
    'ec2:DescribeInternetGateways',
    'ec2:DescribeNetworkInterfaces',
    'ec2:DescribeSecurityGroups',
    'ec2:DescribeSubnets',
    'ec2:DescribeTags',
    'ec2:DescribeVpcs',
    'ec2:ModifyInstanceAttribute',
    'ec2:ModifyNetworkInterfaceAttribute',
    'ec2:RevokeSecurityGroupIngress',
    'elasticloadbalancing:AddListenerCertificates',
    'elasticloadbalancing:AddTags',
    'elasticloadbalancing:CreateListener',
    'elasticloadbalancing:CreateLoadBalancer',
    'elasticloadbalancing:CreateRule',
    'elasticloadbalancing:CreateTargetGroup',
    'elasticloadbalancing:DeleteListener',
    'elasticloadbalancing:DeleteLoadBalancer',
    'elasticloadbalancing:DeleteRule',
    'elasticloadbalancing:DeleteTargetGroup',
    'elasticloadbalancing:DeregisterTargets',
    'elasticloadbalancing:DescribeListenerCertificates',
    'elasticloadbalancing:DescribeListeners',
    'elasticloadbalancing:DescribeLoadBalancers',
    'elasticloadbalancing:DescribeLoadBalancerAttributes',
    'elasticloadbalancing:DescribeRules',
    'elasticloadbalancing:DescribeSSLPolicies',
    'elasticloadbalancing:DescribeTags',
    'elasticloadbalancing:DescribeTargetGroups',
    'elasticloadbalancing:DescribeTargetGroupAttributes',
    'elasticloadbalancing:DescribeTargetHealth',
    'elasticloadbalancing:ModifyListener',
    'elasticloadbalancing:ModifyLoadBalancerAttributes',
    'elasticloadbalancing:ModifyRule',
    'elasticloadbalancing:ModifyTargetGroup',
    'elasticloadbalancing:ModifyTargetGroupAttributes',
    'elasticloadbalancing:RegisterTargets',
    'elasticloadbalancing:RemoveListenerCertificates',
    'elasticloadbalancing:RemoveTags',
    'elasticloadbalancing:SetIpAddressType',
    'elasticloadbalancing:SetSecurityGroups',
    'elasticloadbalancing:SetSubnets',
    'elasticloadbalancing:SetWebAcl',
    'iam:CreateServiceLinkedRole',
    'iam:GetServerCertificate',
    'iam:ListServerCertificates',
    'cognito-idp:DescribeUserPoolClient',
    'waf-regional:GetWebACLForResource',
    'waf-regional:GetWebACL',
    'waf-regional:AssociateWebACL',
    'waf-regional:DisassociateWebACL',
    'tag:GetResources',
    'tag:TagResources',
    'waf:GetWebACL',
    'wafv2:GetWebACL',
    'wafv2:GetWebACLForResource',
    'wafv2:AssociateWebACL',
    'wafv2:DisassociateWebACL',
    'shield:DescribeProtection',
    'shield:GetSubscriptionState',
    'shield:DeleteProtection',
    'shield:CreateProtection',
    'shield:DescribeSubscription',
    'shield:ListProtection',
  ],
  resources: ['*'],
});
const cluster = new eks.Cluster(stack, 'cdk8s-alb', {
  version: eks.KubernetesVersion.V1_17,
  defaultCapacity: 0,
  vpc: new ec2.Vpc(stack, 'newVpc', {
    natGateways: 1,
    maxAzs: 2,
  }),
});
const sa = new eks.ServiceAccount(stack, 'albserviceaccount', {
  cluster: cluster,
  namespace: 'kube-system',
  name: 'alb-ingress-controller',
});
sa.addToPrincipalPolicy(iampolicy);

const myChart = new MyChart(new cdk8s.App(), 'MyChart', {
  clusterName: cluster.clusterName, replicas: 0,
});
cluster.addAutoScalingGroupCapacity('addnoManagedNG', {
  instanceType: new ec2.InstanceType('t3.medium'),
  desiredCapacity: 1,
  spotPrice: '0.0416',
});
const addCdk8sChart = cluster.addCdk8sChart('my-chart', myChart);
const albPatch = new eks.KubernetesPatch(stack, 'patch-replicas-1', {
  cluster,
  resourceName: `deployment/${myChart.deploymentName}`,
  resourceNamespace: myChart.deploymentNameSpace,
  applyPatch: { spec: { replicas: 1 } },
  restorePatch: { spec: { replicas: 0 } },
});
sa.node.addDependency(addCdk8sChart);
albPatch.node.addDependency(sa);
app.synth();