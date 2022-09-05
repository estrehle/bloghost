import { App, Stack } from 'aws-cdk-lib';
import { Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import {
  Code,
  HttpMethod,
  LayerVersion,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { ArticleSvcEnvVars } from './methods/common/environment';
import { CreateArticleMethod } from './methods/CreateArticle';
import { ListArticlesMethod } from './methods/ListArticles';
import { join } from 'path';
import { ArticleSvcStackProps } from '../shared/stack-props';
import { ApiGatewayResources, LambdaLayers } from '../../../util/aws-cdk.types';
import { ArticleSvcTables } from '../storage/storage.stack';

const LAYER_NAMES = ['aws-sdk-v3'] as const;
type ArticleSvcLayers = LambdaLayers<typeof LAYER_NAMES>;

export interface ArticleSvcMethodProps {
  httpMethod: HttpMethod;
  resource: Resource;
  api: RestApi;
  env: ArticleSvcEnvVars;
  layers: ArticleSvcLayers;
  tables: ArticleSvcTables;
}

interface ArticleSvcApplicationStackProps extends ArticleSvcStackProps {
  tables: ArticleSvcTables;
}

export class ArticleSvcApplicationStack extends Stack {
  private readonly resourceNames = ['articles'] as const;
  private readonly layerNames = ['aws-sdk-v3'] as const;

  private readonly props: ArticleSvcApplicationStackProps;

  constructor(app: App, id: string, props: ArticleSvcApplicationStackProps) {
    super(app, id, props);
    this.props = props;

    const api = this.createApi();

    const resources = this.addResources(api);

    const layers = this.addLayers();
    this.addMethods(api, resources, layers);
  }

  private createApi(): RestApi {
    const api = new RestApi(this, 'RestApi', {
      restApiName: 'ArticleSvc-Api',
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

  private addLayers(): ArticleSvcLayers {
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
    layers: ArticleSvcLayers,
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
    layers: ArticleSvcLayers,
  ): Omit<ArticleSvcMethodProps, 'httpMethod' | 'resource'> {
    const tables = this.props.tables;
    const env: ArticleSvcEnvVars = {
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
