/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.config';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File, folder: string = 'products'): Promise<{ url: string; public_id: string }> {
    // Validate file
    if (!file) {
      throw new Error('File is required');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum file size is 5MB.');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF files are allowed.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload error: ${error.message}`));
          } else if (!result) {
            reject(new Error('Cloudinary upload failed: No result returned'));
          } else {
            resolve({ url: result.secure_url, public_id: result.public_id });
          }
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) {
      throw new Error('Public ID is required');
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === 'not_found') {
        console.warn(`Image with public ID ${publicId} not found in Cloudinary`);
      }
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
}