import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { environment } from './common/environment';

const dbClient = new DynamoDBClient({});
const env = environment();

export async function handler(event: {
  body: string;
}): Promise<APIGatewayProxyResult> {
  const data = JSON.parse(event.body);

  try {
    await createArticle(data);
  } catch (e: any) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }
  return { statusCode: 201, body: '' };
}

async function createArticle(item: any): Promise<void> {
  item[env.ARTICLES_PRIMARY_KEY] = uuidv4();

  const command = new PutItemCommand({
    TableName: env.ARTICLES_TABLE_NAME,
    Item: marshall(item),
  });
  await dbClient.send(command);
}
