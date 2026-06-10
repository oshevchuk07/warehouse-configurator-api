import { Module } from "@nestjs/common";
import { IntegrationsController } from "./integrations.controller";
import { IntegrationsService } from "./integrations.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [
    IntegrationsController
  ],
  providers: [
    IntegrationsService
  ],
  exports: [
    IntegrationsService
  ]
})
export class IntegrationsModule { }