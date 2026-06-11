import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  const saltRounds = Number(process.env.PASS_SALT_ROUNDS) || 12;
  const hash = (pwd: string) => bcrypt.hash(pwd, saltRounds);

  console.log('Start seeding...');

  // 1. IntegrationGroups
  const groups = [
    { id: 1, name: 'ERP' },
    { id: 2, name: 'Plataformas de comercio electrónico' },
    { id: 3, name: 'Marketplaces' },
    { id: 4, name: 'Servicios logísticos' },
  ];

  for (const group of groups) {
    await prisma.integrationGroup.upsert({
      where: { id: group.id },
      update: { name: group.name },
      create: group,
    });
  }
  console.log('Integration groups seeded.');

  // 2. Integrations
  const integrations = [
    { id: 1, name: 'odoo', url: 'https://www.odoo.com/', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754212458/services/pxf3j27jy2gnmqbkpdyg.png', isActive: true, groupId: 1 },
    { id: 2, name: 'SAP Business One', url: 'https://www.sap.com/products/erp.html', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754212539/services/n8sii00fq6k6qncbcyxw.png', isActive: true, groupId: 1 },
    { id: 3, name: 'Microsoft Dynamics 365', url: 'https://www.microsoft.com/ru-ru/dynamics-365/what-is-dynamics-365', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754212561/services/kpglsscapl3uvjupaaut.png', isActive: true, groupId: 1 },
    { id: 4, name: 'Erp-next', url: 'https://docs.erpnext.com/', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754213695/services/yehtrkcl3tbuspqrkifs.png', isActive: true, groupId: 1 },
    { id: 5, name: 'Prestashop', url: 'prestashop.com', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754212665/services/ed7vjeuyl4yghm2eja6a.png', isActive: true, groupId: 2 },
    { id: 6, name: 'Woocommerce', url: 'woocommerce.com', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754212812/services/kuqomanqmof1mx4aytho.png', isActive: true, groupId: 2 },
    { id: 7, name: 'Amazon', url: 'Amazon.com', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754212343/services/vhgznf5xn06phldxjevj.png', isActive: true, groupId: 3 },
    { id: 8, name: 'Zalando', url: 'https://zalando.com/', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754212519/services/sycs1guchsrinc5iuuet.png', isActive: true, groupId: 3 },
    { id: 9, name: 'Spartoo', url: 'https://www.spartoo.com/', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754212885/services/rycr3xh31zgz8r7mqdwr.png', isActive: true, groupId: 3 },
    { id: 10, name: 'Aliexpress', url: 'Aliexpress.com', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754212941/services/omwsmku7imlrvdxmuvws.avif', isActive: true, groupId: 3 },
    { id: 11, name: 'El Corte Inglés', url: 'https://www.elcorteingles.es/', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754212966/services/t7dvfwiarr10netyd5xe.png', isActive: true, groupId: 3 },
    { id: 12, name: 'Decathlon', url: 'https://www.decathlon.com/', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754212998/services/kcyhyd2wuu0gqo2w8xqp.png', isActive: true, groupId: 3 },
    { id: 13, name: 'Correo express', url: 'https://www.correosexpress.es/', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754213062/services/zaygfxk3yq48pbvzswqy.png', isActive: true, groupId: 4 },
    { id: 14, name: 'DHL', url: 'DHL.com', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754213092/services/vayt5stgc5qxw4vp57x1.png', isActive: true, groupId: 4 },
    { id: 15, name: 'GLS', url: 'GLS.com', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754213126/services/a1c20oakxtfkuz3gsrkp.png', isActive: true, groupId: 4 },
    { id: 16, name: 'Seur', url: 'Seur.com', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754213148/services/rbz0oviin1q3c28z9rsd.png', isActive: true, groupId: 4 },
    { id: 17, name: 'Parcels', url: 'Parcels.com', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754213190/services/wioruk1v99nmpfvctbww.png', isActive: true, groupId: 4 },
    { id: 18, name: 'Sendalo', url: 'Sendalo.com', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754213208/services/qwsn3r9hjaa3pgddnmwu.png', isActive: true, groupId: 4 },
    { id: 19, name: 'CDiscount', url: 'https://www.cdiscount.com/', description: '', logoImage: 'https://res.cloudinary.com/di8o8zcdu/image/upload/v1754295974/services/i5cosbuwiwanqrtdapje.jpg', isActive: true, groupId: 3 },
  ];

  for (const integration of integrations) {
    await prisma.integration.upsert({
      where: { id: integration.id },
      update: {
        name: integration.name,
        url: integration.url,
        description: integration.description,
        logoImage: integration.logoImage,
        isActive: integration.isActive,
        groupId: integration.groupId,
      },
      create: integration,
    });
  }
  console.log('Integrations seeded.');

  // 3. Plans
  const plans = [
    {
      id: 1,
      name: 'Basic',
      description: 'Save 17% annually',
      subtitle: 'Para emprendedores individuales',
      isActive: true,
      isPopular: false,
      oldMonthlyPrice: 90,
      monthlyPrice: 30,
      oldYearlyPrice: 1000,
      yearlyPrice: 200,
      features: {
        platforms: [{ id: 1, name: 'Prestashop', url: 'prestashop.com', logo: 'Prestashop.svg', isSelected: true }],
        markets: [{ id: 3, name: 'Amazon', url: '', logo: 'Amazon_logo.svg', isSelected: true }],
        logistics: [{ id: 9, name: 'Correo express', url: '', logo: 'correo-express.svg', isSelected: true }],
        erp: [{ logo: 'odoo_logo.png', name: 'odoo', url: 'https://www.odoo.com', isSelected: true }],
      },
    },
    {
      id: 3,
      name: 'Advanced',
      description: 'Facturación anual',
      subtitle: 'A medida que tu negocio escala',
      isActive: true,
      isPopular: true,
      oldMonthlyPrice: null,
      monthlyPrice: 150,
      oldYearlyPrice: null,
      yearlyPrice: 2600,
      features: {
        platforms: [
          { id: 1, name: 'Prestashop', url: 'prestashop.com', logo: 'Prestashop.svg', isSelected: true },
          { id: 2, name: 'Woocommerce', url: 'woocommerce.com', logo: 'WooCommerce-Logo-New.png', isSelected: true },
        ],
        markets: [
          { id: 3, name: 'Amazon', url: '', logo: 'Amazon_logo.svg', isSelected: true },
          { id: 4, name: 'Zalando', url: '', logo: 'zalando.svg', isSelected: true },
          { id: 5, name: 'Spartoo', url: '', logo: 'topLogo.svg', isSelected: true },
        ],
        logistics: [
          { id: 9, name: 'Correo express', url: '', logo: 'correo-express.svg', isSelected: true },
          { id: 10, name: 'DHL', url: '', logo: 'dhl-logo.svg', isSelected: true },
          { id: 11, name: 'GLS', url: '', logo: 'GLS_Logo_RGB_GLSBlue.png', isSelected: true },
        ],
        erp: [
          { logo: 'odoo_logo.png', name: 'odoo', url: 'https://www.odoo.com', isSelected: true },
          { logo: 'sap-logo-svg.svg', name: 'SAP Business One', url: 'https://www.sap.com/products/erp.html', isSelected: true },
        ],
      },
    },
    {
      id: 4,
      name: 'Plus',
      description: 'En un período de tres años',
      subtitle: 'Para negocios más complejos',
      isActive: true,
      isPopular: false,
      oldMonthlyPrice: null,
      monthlyPrice: 300,
      oldYearlyPrice: null,
      yearlyPrice: 3000,
      features: {
        platforms: [
          { id: 1, name: 'Prestashop', url: 'prestashop.com', logo: 'Prestashop.svg', isSelected: true },
          { id: 2, name: 'Woocommerce', url: 'woocommerce.com', logo: 'WooCommerce-Logo-New.png', isSelected: true },
        ],
        markets: [
          { id: 3, name: 'Amazon', url: '', logo: 'Amazon_logo.svg', isSelected: true },
          { id: 4, name: 'Zalando', url: '', logo: 'zalando.svg', isSelected: true },
          { id: 5, name: 'Spartoo', url: '', logo: 'topLogo.svg', isSelected: true },
          { id: 6, name: 'Aliexpress', url: '', logo: 'aliexpress.png', isSelected: true },
          { id: 7, name: 'El Corte Inglés', url: '', logo: 'corte-logo.png', isSelected: true },
          { id: 8, name: 'Decathlon', url: '', logo: 'decathlon.svg', isSelected: true },
        ],
        logistics: [
          { id: 9, name: 'Correo express', url: '', logo: 'correo-express.svg', isSelected: true },
          { id: 10, name: 'DHL', url: '', logo: 'dhl-logo.svg', isSelected: true },
          { id: 11, name: 'GLS', url: '', logo: 'GLS_Logo_RGB_GLSBlue.png', isSelected: true },
          { id: 12, name: 'Seur', url: '', logo: 'seur-logo.png', isSelected: true },
          { id: 13, name: 'Parcels', url: '', logo: 'parcels.png', isSelected: true },
          { id: 14, name: 'Sendalo', url: '', logo: 'logo_sendago.svg', isSelected: true },
        ],
        erp: [
          { logo: 'odoo_logo.png', name: 'odoo', url: 'https://www.odoo.com', isSelected: true },
          { logo: 'sap-logo-svg.svg', name: 'SAP Business One', url: 'https://www.sap.com/products/erp.html', isSelected: true },
          { logo: 'RE1Mu3b.png', name: 'Microsoft Dynamics 365', url: '', isSelected: true },
          { logo: 'erp-next.svg', name: 'Erp-next', url: '', isSelected: true },
        ],
      },
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: {
        name: plan.name,
        description: plan.description,
        subtitle: plan.subtitle,
        isActive: plan.isActive,
        isPopular: plan.isPopular,
        oldMonthlyPrice: plan.oldMonthlyPrice,
        monthlyPrice: plan.monthlyPrice,
        oldYearlyPrice: plan.oldYearlyPrice,
        yearlyPrice: plan.yearlyPrice,
        features: plan.features,
      },
      create: plan,
    });
  }
  console.log('Plans seeded.');

  // 4. PlanIntegrations
  const planIntegrations = [
    { planId: 1, integrationId: 1 },
    { planId: 1, integrationId: 5 },
    { planId: 1, integrationId: 7 },
    { planId: 1, integrationId: 13 },
    { planId: 1, integrationId: 18 },
    { planId: 4, integrationId: 1 },
    { planId: 4, integrationId: 5 },
    { planId: 4, integrationId: 6 },
    { planId: 4, integrationId: 19 },
    { planId: 4, integrationId: 7 },
    { planId: 4, integrationId: 8 },
    { planId: 4, integrationId: 9 },
    { planId: 4, integrationId: 10 },
    { planId: 4, integrationId: 11 },
    { planId: 4, integrationId: 12 },
    { planId: 4, integrationId: 14 },
    { planId: 4, integrationId: 16 },
    { planId: 4, integrationId: 17 },
    { planId: 4, integrationId: 18 },
    { planId: 3, integrationId: 1 },
    { planId: 3, integrationId: 3 },
    { planId: 3, integrationId: 5 },
    { planId: 3, integrationId: 6 },
    { planId: 3, integrationId: 7 },
    { planId: 3, integrationId: 8 },
    { planId: 3, integrationId: 9 },
    { planId: 3, integrationId: 13 },
    { planId: 3, integrationId: 14 },
    { planId: 3, integrationId: 16 },
  ];

  for (const pi of planIntegrations) {
    await prisma.planIntegration.upsert({
      where: {
        planId_integrationId: {
          planId: pi.planId,
          integrationId: pi.integrationId,
        },
      },
      update: {},
      create: pi,
    });
  }
  console.log('Plan-Integration relations seeded.');

  // 5. Admin User
  await prisma.user.upsert({
    where: { email: 'admin@warehouse.com' },
    update: {},
    create: {
      email: 'admin@warehouse.com',
      passwordHash: await hash('123456789'),
      firstName: 'Admin',
      lastName: 'Warehouse',
      role: 'ADMIN',
      isActive: true,
    },
  });

  // 6. Normal Test User
  await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      passwordHash: await hash('123456'),
      firstName: 'User',
      lastName: 'Test',
      role: 'USER',
      isActive: true,
      planId: 4,
      paymentType: 'YEARLY',
    },
  });

  console.log('✅ Seed completed');
  await app.close();
}

void bootstrap();
