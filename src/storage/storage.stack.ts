import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { BlogStackProps } from '../shared/stack-props';

const TABLE_NAMES = ['articles'] as const;

type StorageStackProps = BlogStackProps;

export type BlogTables = { [key in typeof TABLE_NAMES[number]]: Table };

export class StorageStack extends Stack {
  public readonly tables: BlogTables;

  private readonly props: StorageStackProps;

  constructor(app: App, id: string, props: StorageStackProps) {
    super(app, id, props);
    this.props = props;

    this.tables = this.createTables();
  }

  private createTables(): BlogTables {
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
