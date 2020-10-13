import * as cdk8s from 'cdk8s';
import { AlbIngressController } from 'cdk8s-aws-alb-ingress-controller';
import * as constructs from 'constructs';

export interface MyChartProps {
  readonly clusterName: string;
  readonly replicas: number;
}

export class MyChart extends cdk8s.Chart {
  readonly deploymentName: string;
  readonly deploymentNameSpace: string;
  constructor(scope: constructs.Construct, id: string, props: MyChartProps) {
    super(scope, id);
    const alb = new AlbIngressController(this, 'alb', {
      clusterName: props.clusterName,
      replicas: props.replicas,
    });
    this.deploymentName = alb.deploymentName;
    this.deploymentNameSpace = alb.namespace;
  }
}