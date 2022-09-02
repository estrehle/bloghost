import { Resource } from 'aws-cdk-lib/aws-apigateway';

export type ApiGatewayResources<ResourceNames extends readonly string[]> = {
  [key in ResourceNames[number]]: Resource;
};
