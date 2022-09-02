import { Resource } from 'aws-cdk-lib/aws-apigateway';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';

export type ApiGatewayResources<ResourceNames extends readonly string[]> = {
  [key in ResourceNames[number]]: Resource;
};

export type LambdaLayers<LayerNames extends readonly string[]> = {
  [key in LayerNames[number]]: LayerVersion;
}
