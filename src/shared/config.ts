import dotenv from 'dotenv';

const envDevelopment = 'development';
const env = process.env.NODE_ENV || envDevelopment;
dotenv.config({
  path: [`.env.${env}.local`, `.env.${env}`, '.env.local', '.env'],
});

export const config: Record<string, string> = {
  awsAccessKeyId: getRequiredEnv('AWS_ACCESS_KEY_ID'),
  awsSecretAccessKey: getRequiredEnv('AWS_SECRET_ACCESS_KEY'),
  clientOrigin: getRequiredEnv('CLIENT_ORIGIN'),
  env,
  s3ImagesBucket: getRequiredEnv('AWS_S3_IMAGES_BUCKET'),
};

function getRequiredEnv(key: string): string {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return process.env[key];
}
