import { App } from 'aws-cdk-lib';
import { ServiceStack } from './service/service.stack';
import { StorageStack } from './storage/storage.stack';

const app = new App();

const storage = new StorageStack(app, 'Blog-Storage');

new ServiceStack(app, 'Blog-Service', { tables: storage.tables });
