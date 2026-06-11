export interface IStorageService {
  uploadImage(file: Express.Multer.File, folder?: string): Promise<{ url: string; public_id: string }>;
  deleteImage(publicId: string): Promise<void>;
}

export const STORAGE_SERVICE = 'STORAGE_SERVICE';
