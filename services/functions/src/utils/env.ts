import { defineString, defineSecret } from 'firebase-functions/params';

const stringEnvs = ['OPENAI_ORGANIZATION_ID'] as const;
const arrayEnvs = [] as const;
const stringSecrets = ['OPENAI_API_KEY'] as const;

type StringEnvs = (typeof stringEnvs)[number];
type ArrayEnvs = (typeof arrayEnvs)[number];
type StringSecrets = (typeof stringSecrets)[number];
type Envs = StringEnvs | ArrayEnvs;
type Secrets = StringSecrets;
type Env<T> = T extends ArrayEnvs ? string[] : T extends StringEnvs | StringSecrets ? string : undefined;

// NOTE:
// includesは型エラーになるのでfind使ってる
// https://github.com/microsoft/TypeScript/issues/31018
export const env = <T extends Envs | Secrets>(name: T): Env<T> => {
  if (stringEnvs.find((_) => _ === name)) return defineString(name).value() as Env<T>;
  if (arrayEnvs.find((_) => _ === name)) return defineString(name).value().split(', ') as Env<T>;
  if (stringSecrets.find((_) => _ === name)) return defineSecret(name).value() as Env<T>;

  return undefined as Env<T>;
};
