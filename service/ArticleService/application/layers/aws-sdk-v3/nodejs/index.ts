export * from '@aws-sdk/client-dynamodb';
export * from '@aws-sdk/util-dynamodb';

export const AWS_SDK_MODULES = [
  '@aws-sdk/client-dynamodb',
  '@aws-sdk/util-dynamodb',
] as const;
