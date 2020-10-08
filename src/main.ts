import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import * as s3 from '@aws-cdk/aws-s3';
import { App, Stack, RemovalPolicy } from '@aws-cdk/core';
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
// some bucket..
const bucket = new s3.Bucket(stack, 'Bucket', {
  bucketName: 'neilcdk8sekstest',
  removalPolicy: RemovalPolicy.DESTROY,
});

// create a cdk8s chart and use `cdk8s.App` as the scope.
const myChart = new MyChart(new cdk8s.App(), 'MyChart', { bucket });

const cluster = new eks.Cluster(stack, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_17,
  defaultCapacity: 0,
});
cluster.addAutoScalingGroupCapacity('addnoManagedNG', {
  instanceType: new ec2.InstanceType('t3.medium'),
  desiredCapacity: 1,
  spotPrice: '0.0416',

});
// add the cdk8s chart to the cluster
cluster.addCdk8sChart('my-chart', myChart);

app.synth();