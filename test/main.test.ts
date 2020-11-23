import '@aws-cdk/assert/jest';
import { App, Stack } from '@aws-cdk/core';
import * as main from '../src/main';

test('Create the EKS', () => {
  const mockApp = new App();
  const stack = new Stack(mockApp);
  new main.MainStack(stack, 'Mainstack');
  expect(stack).toHaveResource('AWS::IAM::Role');
});