import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';

export const commonLambdaProps: NodejsFunctionProps = {
  bundling: {
    externalModules: ['aws-sdk'],
  },
  runtime: Runtime.NODEJS_16_X,
};
