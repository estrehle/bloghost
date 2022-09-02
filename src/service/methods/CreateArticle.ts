import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { BlogApiMethodProps } from '../service.stack';
import { commonLambdaProps } from './common/lambda-props';

export class CreateArticleMethod extends Construct {
  constructor(scope: Construct, id: string, props: BlogApiMethodProps) {
    super(scope, id);

    const fn = new NodejsFunction(this, 'Handler', {
      entry: join(__dirname, 'CreateArticle.handler.ts'),
      environment: props.env,
      ...commonLambdaProps,
      layers: [props.layers['aws-sdk-v3']],
    });

    props.tables.articles.grantWriteData(fn);

    props.resource.addMethod(props.httpMethod, new LambdaIntegration(fn));
  }
}
