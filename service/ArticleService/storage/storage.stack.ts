import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ArticleSvcStackProps } from '../shared/stack-props';

const TABLE_NAMES = ['articles'] as const;

type ArticleSvcStorageStackProps = ArticleSvcStackProps;

export type ArticleSvcTables = { [key in typeof TABLE_NAMES[number]]: Table };

export class ArticleSvcStorageStack extends Stack {
  public readonly tables: ArticleSvcTables;

  private readonly props: ArticleSvcStorageStackProps;

  constructor(app: App, id: string, props: ArticleSvcStorageStackProps) {
    super(app, id, props);
    this.props = props;

    this.tables = this.createTables();
  }

  private createTables(): ArticleSvcTables {
    const removalPolicy = this.props.isProduction
      ? RemovalPolicy.RETAIN
      : RemovalPolicy.DESTROY;

    return {
      articles: new Table(this, 'ArticlesTable', {
        partitionKey: {
          name: 'id',
          type: AttributeType.STRING,
        },
        removalPolicy,
      }),
    };
  }
}
