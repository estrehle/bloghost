import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyResult } from 'aws-lambda';
import { environment } from './common/environment';

const dbClient = new DynamoDBClient({});
const env = environment();

export async function handler(): Promise<APIGatewayProxyResult> {
  let result: Record<string, any>;
  try {
    result = await listArticles();
  } catch (e: any) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }

  return { statusCode: 200, body: JSON.stringify({ result }) };
}

export async function listArticles(): Promise<Record<string, any>> {
  const command = new ScanCommand({ TableName: env.ARTICLES_TABLE_NAME });
  const res = await dbClient.send(command);
  const result = res.Items?.map((item) => unmarshall(item)) ?? [];
  return result;
}
