import '@aws-cdk/assert/jest';
import { App, Stack } from '@aws-cdk/core';
import * as main from '../src/main';

test('Create the EKS', () => {
  const mockApp = new App();
  const stack = new Stack(mockApp);
  new main.MainStack(stack, 'Mainstack');
  expect(stack).toHaveResource('AWS::IAM::Role');
  expect(stack).toHaveResource('Custom::AWSCDK-EKS-KubernetesResource', {
    Manifest: {
      'Fn::Join': [
        '',
        [
          '[{\"apiVersion\":\"rbac.authorization.k8s.io/v1\",\"kind\":\"ClusterRole\",\"metadata\":{\"labels\":{\"app.kubernetes.io/name\":\"alb-ingress-controller\"},\"name\":\"alb-ingress-controller\"},\"rules\":[{\"apiGroups\":[\"\",\"extensions\"],\"resources\":[\"configmaps\",\"endpoints\",\"events\",\"ingresses\",\"ingresses/status\",\"services\",\"pods/status\"],\"verbs\":[\"create\",\"get\",\"list\",\"update\",\"watch\",\"patch\"]},{\"apiGroups\":[\"\",\"extensions\"],\"resources\":[\"nodes\",\"pods\",\"secrets\",\"services\",\"namespaces\"],\"verbs\":[\"get\",\"list\",\"watch\"]}]},{\"apiVersion\":\"rbac.authorization.k8s.io/v1\",\"kind\":\"ClusterRoleBinding\",\"metadata\":{\"labels\":{\"app.kubernetes.io/name\":\"alb-ingress-controller\"},\"name\":\"alb-ingress-controller\"},\"roleRef\":{\"apiGroup\":\"rbac.authorization.k8s.io\",\"kind\":\"ClusterRole\",\"name\":\"alb-ingress-controller\"},\"subjects\":[{\"kind\":\"ServiceAccount\",\"name\":\"alb-ingress-controller\",\"namespace\":\"kube-system\"}]},{\"apiVersion\":\"v1\",\"kind\":\"ServiceAccount\",\"metadata\":{\"name\":\"alb-ingress-controller\",\"namespace\":\"kube-system\"}},{\"apiVersion\":\"apps/v1\",\"kind\":\"Deployment\",\"metadata\":{\"labels\":{\"app.kubernetes.io/name\":\"alb-ingress-controller\"},\"name\":\"alb-ingress-controller\",\"namespace\":\"kube-system\"},\"spec\":{\"replicas\":0,\"selector\":{\"matchLabels\":{\"app.kubernetes.io/name\":\"alb-ingress-controller\"}},\"template\":{\"metadata\":{\"labels\":{\"app.kubernetes.io/name\":\"alb-ingress-controller\"}},\"spec\":{\"containers\":[{\"args\":[\"--ingress-class=alb\",\"--cluster-name=',
          {
            Ref: 'Mainstackcdk8salbED4A85AB',
          },
          '\"],\"image\":\"docker.io/amazon/aws-alb-ingress-controller:v1.1.9\",\"name\":\"alb-ingress-controller\"}],\"serviceAccountName\":\"alb-ingress-controller\"}}}}]',
        ],
      ],
    },
  });
});