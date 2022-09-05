export type EnvVars<T extends readonly string[]> = {
  [key in T[number]]: string;
};

export function getEnvVars<T extends readonly string[]>(
  envVarNames: T,
): EnvVars<T> {
  return Object.fromEntries(
    envVarNames.map((envVarName) => [
      envVarName,
      process.env[envVarName] ?? '',
    ]),
  ) as EnvVars<T>;
}
