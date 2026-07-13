

import { v2 as cloudinary } from "cloudinary";

import { CLOUDE_NAME, CLOUDE_API_KEY, CLOUDE_API_SECRET } from "../hiddenEnv.js";


cloudinary.config({
  cloud_name: CLOUDE_NAME,
  api_key: CLOUDE_API_KEY,
  api_secret: CLOUDE_API_SECRET,
});


export const DeleteFileFromCloudinary = async (folderName, publicId) => {
    try {
        const response = await cloudinary.uploader.destroy(`${folderName}/${publicId}`);
        console.log('Cloudinary response:', response);

        if (response.result === 'not found') {
            console.warn(`Image with public ID ${publicId} was not found on Cloudinary.`);
            return; // Return without throwing an error
        }

        if (response.result !== 'ok') {
            throw new Error(`Image with public ID ${publicId} was not deleted successfully from Cloudinary. Reason: ${response.result}`);
        }
    } catch (error) {
        throw error;
    }
}


export const UploadBufferToCloudinary = (
  buffer,
  folderName = "blueprint/company-logos",
  resourceType = "image"
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve({ secureUrl: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
};
