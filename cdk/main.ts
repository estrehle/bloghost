import { App } from 'aws-cdk-lib';
import { ArticleSvcApplicationStack } from '../service/ArticleService/application/application.stack';
import { ArticleSvcStorageStack } from '../service/ArticleService/storage/storage.stack';

const isProduction = false;

const app = new App();

const storage = new ArticleSvcStorageStack(app, 'ArticleSvc-Storage', {
  isProduction,
});

new ArticleSvcApplicationStack(app, 'ArticleSvc-Application', {
  isProduction,
  tables: storage.tables,
});
