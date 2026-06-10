import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PlanModule } from './plan/plan.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EmailModule } from './email/email.module';

@Module({
imports: [
  AuthModule,
  PrismaModule,
  UsersModule,
  PlanModule,
  IntegrationsModule,
  CloudinaryModule,
  EmailModule
],
controllers: [AppController],
providers: [AppService],
})
export class AppModule {}
