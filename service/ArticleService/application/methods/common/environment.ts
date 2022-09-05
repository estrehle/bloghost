import { EnvVars, getEnvVars } from '../../../../../util/get-env-vars';

const ARTICLE_SVC_ENV_VARS = [
  'ARTICLES_PRIMARY_KEY',
  'ARTICLES_TABLE_NAME',
] as const;

export type ArticleSvcEnvVars = EnvVars<typeof ARTICLE_SVC_ENV_VARS>;

export function environment(): ArticleSvcEnvVars {
  return getEnvVars(ARTICLE_SVC_ENV_VARS);
}
