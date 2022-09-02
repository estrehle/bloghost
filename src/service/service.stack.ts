import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Resource, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { HttpMethod } from 'aws-cdk-lib/aws-lambda';
import { ApiGatewayResources } from '../misc/types';
import { BlogTables } from '../storage/storage.stack';
import { BlogApiEnv } from './methods/common/environment';
import { CreateArticleMethod } from './methods/CreateArticle';
import { ListArticlesMethod } from './methods/ListArticles';

export interface BlogApiMethodProps {
  httpMethod: HttpMethod;
  resource: Resource;
  api: RestApi;
  env: BlogApiEnv;
  tables: BlogTables;
}

interface ServiceStackProps extends StackProps {
  tables: BlogTables;
}

export class ServiceStack extends Stack {
  private readonly resourceNames = ['articles'] as const;

  private readonly props: ServiceStackProps;

  constructor(app: App, id: string, props: ServiceStackProps) {
    super(app, id, props);
    this.props = props;

    const api = this.createApi();

    const resources = this.addResources(api);

    this.addMethods(api, resources);
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

  private addMethods(
    api: RestApi,
    resources: ApiGatewayResources<typeof this.resourceNames>,
  ): void {
    const commonMethodProps = this.getCommonMethodProps(api);

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
  ): Omit<BlogApiMethodProps, 'httpMethod' | 'resource'> {
    const tables = this.props.tables;
    const env: BlogApiEnv = {
      ARTICLES_PRIMARY_KEY: tables.articles.schema().partitionKey.name,
      ARTICLES_TABLE_NAME: tables.articles.tableName,
    };

    return {
      api,
      env,
      tables,
    };
  }
}
