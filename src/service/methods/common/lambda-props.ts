import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { AWS_SDK_MODULES } from '../../layers/aws-sdk-v3/nodejs';

export const commonLambdaProps: NodejsFunctionProps = {
  bundling: {
    externalModules: [...AWS_SDK_MODULES],
  },
  runtime: Runtime.NODEJS_16_X,
};
