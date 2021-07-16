import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import { App, Stack, Construct } from '@aws-cdk/core';
import * as cdk8s from 'cdk8s';
import { AwsLoadBalancePolicy, VersionsLists } from 'cdk8s-aws-load-balancer-controller';
import { AwsExternalDnsPolicyHelper } from 'cdk8s-external-dns';
import { MyChartV2, externalDNS } from './mycdk8s';
// exmaple for v2
export class MainStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const vpc = new ec2.Vpc(this, 'newVpc', {
      natGateways: 1,
      maxAzs: 2,
    });
    const cluster = new eks.Cluster(this, 'cdk8s-alb', {
      version: eks.KubernetesVersion.V1_18,
      defaultCapacity: 0,
      clusterName: 'albIngressDemo',
      vpc,
    });
    const sa = new eks.ServiceAccount(this, 'albserviceaccount', {
      cluster: cluster,
      name: 'aws-load-balancer-controller',
    });
    const externaldnsChart = new externalDNS(new cdk8s.App(), 'externalDNSchart', {
      domainFilter: this.node.tryGetContext('domain'),
    });
    const dnssa = new eks.ServiceAccount(this, 'dnsserviceaccount', {
      cluster: cluster,
      name: externaldnsChart.serviceAccountName,
      namespace: externaldnsChart.namespace,
    });
    AwsExternalDnsPolicyHelper.addPolicy(dnssa);
    AwsLoadBalancePolicy.addPolicy(
      VersionsLists.AWS_LOAD_BALANCER_CONTROLLER_POLICY_V2, sa );
    const myChart = new MyChartV2(new cdk8s.App(), 'MyChart', {
      clusterName: cluster.clusterName,
    });
    // ASG node group
    cluster.addAutoScalingGroupCapacity('addnoManagedNG', {
      instanceType: new ec2.InstanceType('t3.medium'),
      desiredCapacity: 1,
      spotPrice: '0.0416',
    });
    const addCdk8sChart = cluster.addCdk8sChart('my-chart', myChart);
    const adddnschart = cluster.addCdk8sChart('adddnschart', externaldnsChart);
    adddnschart.node.addDependency(dnssa);
    addCdk8sChart.node.addDependency(sa);

  }
}
// for development, use account/region from cdk cli

const app = new App();

// new stack
new MainStack(app, 'MainStack');
app.synth();

// V1 example
// const devEnv = {
//   account: process.env.CDK_DEFAULT_ACCOUNT,
//   region: process.env.CDK_DEFAULT_REGION,
// };

// const app = new App();

// // new stack
// const stack = new Stack(app, 'EKSstack', {
//   env: devEnv,
// });

// export class MainStack extends Construct {
//   constructor(scope: Construct, id: string) {
//     super(scope, id);
//     const cluster = new eks.Cluster(this, 'cdk8s-alb', {
//       version: eks.KubernetesVersion.V1_18,
//       defaultCapacity: 0,
//       clusterName: 'albIngressDemo',
//       vpc: new ec2.Vpc(this, 'newVpc', {
//         natGateways: 1,
//         maxAzs: 2,
//       }),
//     });
//     const sa = new eks.ServiceAccount(this, 'albserviceaccount', {
//       cluster: cluster,
//       namespace: 'kube-system',
//       name: 'alb-ingress-controller',
//     });
//     AwsLoadBalancePolicy.addPolicy(VersionsLists.AWS_LOAD_BALANCER_CONTROLLER_POLICY_V1, sa );
//     const myChart = new MyChartV1(new cdk8s.App(), 'MyChart', {
//       clusterName: cluster.clusterName, replicas: 0,
//     });
//     cluster.addAutoScalingGroupCapacity('addnoManagedNG', {
//       instanceType: new ec2.InstanceType('t3.medium'),
//       desiredCapacity: 1,
//       spotPrice: '0.0416',
//     });

//     const addCdk8sChart = cluster.addCdk8sChart('my-chart', myChart);
//     const albPatch = new eks.KubernetesPatch(this, 'patch-replicas-1', {
//       cluster,
//       resourceName: `deployment/${myChart.deploymentName}`,
//       resourceNamespace: myChart.deploymentNameSpace,
//       applyPatch: { spec: { replicas: 1 } },
//       restorePatch: { spec: { replicas: 0 } },
//     });
//     sa.node.addDependency(addCdk8sChart);
//     albPatch.node.addDependency(sa);
//   }
// }

// new MainStack(stack, 'MainStack');
// app.synth();