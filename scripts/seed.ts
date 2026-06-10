import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  const saltRounds = Number(process.env.PASS_SALT_ROUNDS) || 12;
  const hash = (pwd: string) => bcrypt.hash(pwd, saltRounds);

  console.log('Start seeding..')

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@warehouse.com' },
    update: {},
    create: {
      email: 'admin@warehouse.com',
      hash: await hash('123456789'),
      firstName: 'Admin',
      lastName: 'Warehouse',
      role: 'ADMIN',
      isActive: true
    }
  })

  // User 
  await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      hash: '123456',
      firstName: 'User',
      lastName: 'Test',
      role: 'USER',
      isActive: true
    }
  })

  console.log('✅ Seed completed');
  await app.close();
}

void bootstrap();
