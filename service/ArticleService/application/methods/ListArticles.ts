import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { ArticleSvcMethodProps } from '../application.stack';
import { commonLambdaProps } from './common/lambda-props';

export class ListArticlesMethod extends Construct {
  constructor(scope: Construct, id: string, props: ArticleSvcMethodProps) {
    super(scope, id);

    const fn = new NodejsFunction(this, 'Handler', {
      entry: join(__dirname, 'ListArticles.handler.ts'),
      environment: props.env,
      ...commonLambdaProps,
      layers: [props.layers['aws-sdk-v3']],
    });

    props.tables.articles.grantReadData(fn);

    props.resource.addMethod(props.httpMethod, new LambdaIntegration(fn));
  }
}
