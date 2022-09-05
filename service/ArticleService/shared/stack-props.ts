import { StackProps } from 'aws-cdk-lib';

export interface ArticleSvcStackProps extends StackProps {
  isProduction: boolean;
}
