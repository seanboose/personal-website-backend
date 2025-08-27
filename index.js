import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const env = process.env.NODE_ENV || 'development';
dotenv.config({
  path: [`.env.${env}.local`, `.env.${env}`, '.env.local', '.env'],
});

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const s3ImagesBucket = 'boose-personal-website-images-dev';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET'],
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.get('/api/listImages', async (req, res) => {
  let images = [];
  if (env !== 'development') {
    return res.status(501).json({ images });
  }

  const command = new ListObjectsV2Command({
    Bucket: s3ImagesBucket,
  });
  const response = await s3.send(command);
  if (response.Contents) {
    const fileNames = response.Contents.map((item) => {
      return item.Key;
    });
    const imageUrls = await getImageUrls(fileNames);
    images = fileNames.map((fileName) => ({
      fileName,
      url: imageUrls[fileName],
    }));
  }
  res.json({ images });
});

async function getImageUrls(images) {
  const signedUrls = {};
  for (const key of images) {
    const url = await generateSignedUrl(key);
    signedUrls[key] = url;
  }
  return signedUrls;
}

async function generateSignedUrl(key) {
  const command = new GetObjectCommand({
    Bucket: s3ImagesBucket,
    Key: key,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
