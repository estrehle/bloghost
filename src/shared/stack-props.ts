import { StackProps } from 'aws-cdk-lib';

export interface BlogStackProps extends StackProps {
  isProduction: boolean;
}
