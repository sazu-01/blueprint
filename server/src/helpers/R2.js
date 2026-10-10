
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { R2_ACCOUNT_ID, R2_SECRET_ACCESS_KEY, R2_ACCESS_KEY_ID, R2_BUCKET } from "../hiddenEnv.js";
 

const r2  = new S3Client({
    region:"auto",
    endpoint:`https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    }
});


export const UploadBufferToR2 = async (buffer, folder, originalName, contentType) => {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${crypto.randomUUID()}-${safeName}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return { key };
};


// private ফাইল দেখার জন্য সীমিত সময়ের লিংক (ডিফল্ট ১ ঘণ্টা)
export const GetR2SignedUrl = (key, expiresIn = 3600) =>
  getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    { expiresIn }
  );


  export const DeleteFileFromR2 = (key) =>
  r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));