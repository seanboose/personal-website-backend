import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { ImageData } from '@seanboose/personal-website-api-types';

import { s3 } from '../../shared/aws.js';
import { config } from '../../shared/config.js';

export const getImageList = async () => {
  let images: ImageData[] = [];
  if (!config.s3ImagesBucket) {
    throw new Error('images bucket not defined');
  }

  const command = new ListObjectsV2Command({
    Bucket: config.s3ImagesBucket,
  });
  const response = await s3.send(command);
  if (response.Contents) {
    const fileNames = response.Contents.map((item) => {
      return item.Key;
    }).filter((key) => key !== undefined);
    const imageUrls = await getImageUrls(fileNames);
    images = fileNames.map((fileName) => ({
      fileName,
      url: imageUrls[fileName],
    }));
  }
  return images;
};

async function getImageUrls(images: string[]): Promise<Record<string, string>> {
  const signedUrls: Record<string, string> = {};
  for (const key of images) {
    const url = await generateSignedUrl(key);
    signedUrls[key] = url;
  }
  return signedUrls;
}

async function generateSignedUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: config.s3ImagesBucket,
    Key: key,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
}
