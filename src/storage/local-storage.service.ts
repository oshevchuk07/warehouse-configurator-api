import { Injectable } from '@nestjs/common';
import { IStorageService } from './storage.interface';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly uploadPath = 'uploads';

  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'general'): Promise<{ url: string; public_id: string }> {
    if (!file) {
      throw new Error('File is required');
    }

    const folderPath = path.join(this.uploadPath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(folderPath, fileName);

    await fs.promises.writeFile(filePath, file.buffer);

    // public_id for local storage will be the path relative to uploads
    const public_id = path.join(folder, fileName).replace(/\\/g, '/');
    const url = `/uploads/${public_id}`;

    return { url, public_id };
  }

  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) return;

    const filePath = path.join(this.uploadPath, publicId);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}
