import { S3Client } from '@aws-sdk/client-s3';

import { config } from './config.js';

export const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
});
