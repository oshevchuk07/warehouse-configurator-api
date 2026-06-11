import { Module, Global } from '@nestjs/common';
import { STORAGE_SERVICE } from './storage.interface';
import { LocalStorageService } from './local-storage.service';
import { CloudinaryStorageService } from './cloudinary-storage.service';

@Global()
@Module({
  providers: [
    {
      provide: STORAGE_SERVICE,
      useFactory: () => {
        const storageType = process.env.STORAGE_TYPE || 'local';
        return storageType === 'cloudinary' ? new CloudinaryStorageService() : new LocalStorageService();
      },
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
