/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import cloudinary from '../cloudinary/cloudinary.config';
import { Readable } from 'stream';
import { IStorageService } from './storage.interface';

@Injectable()
export class CloudinaryStorageService implements IStorageService {
  async uploadImage(file: Express.Multer.File, folder: string = 'products'): Promise<{ url: string; public_id: string }> {
    // Validate file
    if (!file) {
      throw new Error('File is required');
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
    if (!publicId) return;

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
}
