import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const s3ImagesBucket = 'boose-personal-website-images-dev';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: 'http://localhost:5173',
      methods: ['GET'],
      credentials: true,
    })
  );
}
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.get('/api/listImages', async (req, res) => {
  if (env !== 'development') {
    return res.status(501).json({ images: [] });
  }

  const command = new ListObjectsV2Command({
    Bucket: s3ImagesBucket,
  });
  const response = await s3.send(command);
  if (response.Contents) {
    const images = response.Contents.map((item) => {
      return item.Key;
    });
    res.json({ images });
  } else {
    res.json({ images: [] });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
