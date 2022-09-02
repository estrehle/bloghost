import { App, Stack } from 'aws-cdk-lib';
import { Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import {
  Code,
  HttpMethod,
  LayerVersion,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { BlogStackProps } from '../shared/stack-props';
import { ApiGatewayResources, LambdaLayers } from '../misc/types';
import { BlogTables } from '../storage/storage.stack';
import { BlogApiEnv } from './methods/common/environment';
import { CreateArticleMethod } from './methods/CreateArticle';
import { ListArticlesMethod } from './methods/ListArticles';
import { join } from 'path';

const LAYER_NAMES = ['aws-sdk-v3'] as const;
type BlogApiLayers = LambdaLayers<typeof LAYER_NAMES>;

export interface BlogApiMethodProps {
  httpMethod: HttpMethod;
  resource: Resource;
  api: RestApi;
  env: BlogApiEnv;
  layers: BlogApiLayers;
  tables: BlogTables;
}

interface ServiceStackProps extends BlogStackProps {
  tables: BlogTables;
}

export class ServiceStack extends Stack {
  private readonly resourceNames = ['articles'] as const;
  private readonly layerNames = ['aws-sdk-v3'] as const;

  private readonly props: ServiceStackProps;

  constructor(app: App, id: string, props: ServiceStackProps) {
    super(app, id, props);
    this.props = props;

    const api = this.createApi();

    const resources = this.addResources(api);

    const layers = this.addLayers();
    this.addMethods(api, resources, layers);
  }

  private createApi(): RestApi {
    const api = new RestApi(this, 'RestApi', {
      restApiName: 'Blog-Api',
    });

    return api;
  }

  private addResources(
    api: RestApi,
  ): ApiGatewayResources<typeof this.resourceNames> {
    const articles = api.root.addResource('articles');

    return {
      articles,
    };
  }

  private addLayers(): BlogApiLayers {
    return {
      'aws-sdk-v3': new LayerVersion(this, 'AwsSdkV3', {
        compatibleRuntimes: [Runtime.NODEJS_16_X],
        code: Code.fromAsset(join(__dirname, 'layers', 'aws-sdk-v3')),
        description: 'AWS SDK v3 modules',
      }),
    };
  }

  private addMethods(
    api: RestApi,
    resources: ApiGatewayResources<typeof this.resourceNames>,
    layers: BlogApiLayers,
  ): void {
    const commonMethodProps = this.getCommonMethodProps(api, layers);

    new CreateArticleMethod(this, 'CreateArticle', {
      httpMethod: HttpMethod.POST,
      resource: resources['articles'],
      ...commonMethodProps,
    });

    new ListArticlesMethod(this, 'ListArticles', {
      httpMethod: HttpMethod.GET,
      resource: resources['articles'],
      ...commonMethodProps,
    });
  }

  private getCommonMethodProps(
    api: RestApi,
    layers: BlogApiLayers,
  ): Omit<BlogApiMethodProps, 'httpMethod' | 'resource'> {
    const tables = this.props.tables;
    const env: BlogApiEnv = {
      ARTICLES_PRIMARY_KEY: tables.articles.schema().partitionKey.name,
      ARTICLES_TABLE_NAME: tables.articles.tableName,
    };

    return {
      api,
      env,
      layers,
      tables,
    };
  }
}
