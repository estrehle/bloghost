import * as AWS from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import { environment } from './common/environment';

const db = new AWS.DynamoDB.DocumentClient();
const env = environment();

export async function handler(): Promise<APIGatewayProxyResult> {
  let result: AWS.DynamoDB.DocumentClient.ItemList;
  try {
    result = await listArticles();
  } catch (e: any) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }

  return { statusCode: 200, body: JSON.stringify({ result }) };
}

export async function listArticles(): Promise<AWS.DynamoDB.DocumentClient.ItemList> {
  const result = await db
    .scan({ TableName: env.ARTICLES_TABLE_NAME })
    .promise();
  return result.Items ?? [];
}
