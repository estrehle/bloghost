import { APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { environment } from './common/environment';

const db = new AWS.DynamoDB.DocumentClient();
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

export async function createArticle(item: any): Promise<void> {
  item[env.ARTICLES_PRIMARY_KEY] = uuidv4();

  await db
    .put({
      TableName: env.ARTICLES_TABLE_NAME,
      Item: item,
    })
    .promise();
}
