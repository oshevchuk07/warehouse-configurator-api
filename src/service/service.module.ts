import { Module } from "@nestjs/common";
import { ServiceController } from "./service.controller";
import { ServiceService } from "./service.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [
    ServiceController
  ],
  providers: [
    ServiceService
  ],
  exports: [
    ServiceService
  ]
})
export class ServiceModule { }