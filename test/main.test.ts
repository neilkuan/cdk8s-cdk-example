import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { MainStack } from '../src/main';

test('Snapshot', () => {
  const app = new App();
  const stack = new MainStack(app, 'test');
  expect(stack).toHaveResource('Custom::AWSCDK-EKS-KubernetesResource');
});