import { App } from 'aws-cdk-lib';
import { ServiceStack } from './service/service.stack';
import { StorageStack } from './storage/storage.stack';

const isProduction = false;

const app = new App();

const storage = new StorageStack(app, 'Blog-Storage', {
  isProduction,
});

new ServiceStack(app, 'Blog-Service', { isProduction, tables: storage.tables });
