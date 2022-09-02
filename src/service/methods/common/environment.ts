const BLOG_API_ENVVARS = [
  'ARTICLES_PRIMARY_KEY',
  'ARTICLES_TABLE_NAME',
] as const;

export type BlogApiEnv = { [key in typeof BLOG_API_ENVVARS[number]]: string };

export function environment(): BlogApiEnv {
  return Object.fromEntries(
    BLOG_API_ENVVARS.map((envVar) => [envVar, process.env[envVar] ?? '']),
  ) as BlogApiEnv;
}
