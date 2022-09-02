import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

const TABLE_NAMES = ['articles'] as const;

export type BlogTables = { [key in typeof TABLE_NAMES[number]]: Table };

export class StorageStack extends Stack {
  public readonly tables: BlogTables;

  constructor(app: App, id: string, props?: StackProps) {
    super(app, id, props);

    this.tables = this.createTables();
  }

  private createTables(): BlogTables {
    /**
     * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
     * the new table, and it will remain in your account until manually deleted. By setting the policy to
     * DESTROY, cdk destroy will delete the table (even if it has data in it)
     */
    const removalPolicy = RemovalPolicy.DESTROY; // NOT recommended for production code

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
