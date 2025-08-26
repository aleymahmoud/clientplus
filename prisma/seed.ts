import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Domains
  const consulting = await prisma.domain.create({
    data: {
      id: 1,
      domainName: 'Consulting',
    },
  });

  const marketing = await prisma.domain.create({
    data: {
      id: 2,
      domainName: 'Marketing',
    },
  });

  const community = await prisma.domain.create({
    data: {
      id: 3,
      domainName: 'Community',
    },
  });

  const academy = await prisma.domain.create({
    data: {
      id: 4,
      domainName: 'Academy',
    },
  });

  const businessDevelopment = await prisma.domain.create({
    data: {
      id: 5,
      domainName: 'Business Development',
    },
  });

  // Create Subdomains
  const subdomains = [
    { id: 1, domainId: 1, subdomainName: 'AB&Associates', leadConsultant: 'youssef' },
    { id: 2, domainId: 1, subdomainName: 'Cyber Talents', leadConsultant: 'reem' },
    { id: 3, domainId: 1, subdomainName: 'Ecology', leadConsultant: 'youssef' },
    { id: 4, domainId: 1, subdomainName: 'ElAbd', leadConsultant: 'momen' },
    { id: 5, domainId: 1, subdomainName: 'ENGAGE', leadConsultant: 'momen' },
    { id: 6, domainId: 1, subdomainName: 'HOFT Academy', leadConsultant: 'islam' },
    { id: 7, domainId: 1, subdomainName: 'Lemon Spaces (R)', leadConsultant: 'momen' },
    { id: 8, domainId: 1, subdomainName: 'Raya Trade', leadConsultant: 'magdy' },
    { id: 9, domainId: 1, subdomainName: 'TBC', leadConsultant: 'islam' },
    { id: 10, domainId: 1, subdomainName: 'Wander', leadConsultant: 'galal' },
    { id: 11, domainId: 1, subdomainName: 'UAFL', leadConsultant: 'islam' },
    { id: 12, domainId: 1, subdomainName: 'Expanders', leadConsultant: 'momen' },
    { id: 13, domainId: 2, subdomainName: 'Forefront', leadConsultant: 'raneem' },
    { id: 14, domainId: 2, subdomainName: 'Islam PB', leadConsultant: 'raneem' },
    { id: 15, domainId: 2, subdomainName: 'Team Internal', leadConsultant: 'raneem' },
    { id: 16, domainId: 2, subdomainName: 'External Client', leadConsultant: 'raneem' },
    { id: 17, domainId: 3, subdomainName: 'Strategy Community', leadConsultant: 'raneem' },
    { id: 18, domainId: 3, subdomainName: 'Consulting Community', leadConsultant: 'raneem' },
    { id: 21, domainId: 4, subdomainName: 'LMS', leadConsultant: 'galal' },
    { id: 22, domainId: 4, subdomainName: 'Content', leadConsultant: 'galal' },
    { id: 23, domainId: 4, subdomainName: 'Marketing', leadConsultant: 'galal' },
    { id: 26, domainId: 5, subdomainName: 'Potential Client Meeting', leadConsultant: 'magdy' },
    { id: 27, domainId: 5, subdomainName: 'Partner Meeting', leadConsultant: 'magdy' },
    { id: 28, domainId: 5, subdomainName: 'Back office Work', leadConsultant: 'magdy' },
  ];

  for (const subdomain of subdomains) {
    await prisma.subdomain.create({
      data: subdomain,
    });
  }

  // Create Users
  const users = [
    { id: 'user_1000', email: 'islam.saddany@forefront.consulting', username: 'islam', role: 'SUPER_USER' },
    { id: 'user_1001', email: 'youssef.moataz@forefront.consulting', username: 'youssef', role: 'CONSULTANT' },
    { id: 'user_1002', email: 'momen.zaki@forefront.consulting', username: 'momen', role: 'CONSULTANT' },
    { id: 'user_1003', email: 'aley.mahmoud@forefront.consulting', username: 'aley', role: 'SUPER_USER' },
    { id: 'user_1004', email: 'marwa.abdelazeem@forefront.consulting', username: 'marwa', role: 'SUPPORTING' },
    { id: 'user_1005', email: 'reem.elbarbary@forefront.consulting', username: 'reem', role: 'SUPPORTING' },
    { id: 'user_1006', email: 'mohamed.magdy@forefront.consulting', username: 'magdy', role: 'CONSULTANT' },
    { id: 'user_1007', email: 'ahmed.galal@forefront.consulting', username: 'galal', role: 'CONSULTANT' },
  ];

  const hashedPassword = await bcrypt.hash('ClientPlus2024!', 10);

  for (const userData of users) {
    await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  // Create Super Users
  await prisma.superUser.create({
    data: {
      userId: 'user_1000',
      username: 'islam',
    },
  });

  await prisma.superUser.create({
    data: {
      userId: 'user_1003',
      username: 'aley',
    },
  });

  // Create Clients
  const clients = [
    { clientName: 'AB&Associates', type: 'PRJ', status: 'A', activity: 'Client' },
    { clientName: 'Abdel Latif Jameel', type: 'PRJ', status: 'E', activity: 'Client' },
    { clientName: 'AlAmal AlSharif', type: 'PRJ', status: 'E', activity: 'Client' },
    { clientName: 'AMAN Holding', type: 'PRJ', status: 'E', activity: 'Client' },
    { clientName: 'Bosta', type: 'PRJ', status: 'E', activity: 'Client' },
    { clientName: 'Chefaa', type: 'PRJ', status: 'E', activity: 'Client' },
    { clientName: 'Code Club', type: 'PRJ', status: 'E', activity: 'Client' },
    { clientName: 'Cyber Talents', type: 'PRJ', status: 'A', activity: 'Client' },
    { clientName: 'Ecology', type: 'RET', status: 'A', activity: 'Client' },
    { clientName: 'ElAbd', type: 'RET', status: 'A', activity: 'Client' },
    { clientName: 'ENGAGE', type: 'PRJ', status: 'A', activity: 'Client' },
    { clientName: 'FF Ex-Meeting', type: 'FFNT', status: 'A', activity: 'FFNT' },
    { clientName: 'FF In-Meeting', type: 'FFNT', status: 'A', activity: 'FFNT' },
    { clientName: 'Forefront', type: 'FFNT', status: 'A', activity: 'FFNT' },
    { clientName: 'HOFT Academy', type: 'PRJ', status: 'A', activity: 'Client' },
    { clientName: 'Lemon Spaces (R)', type: 'RET', status: 'A', activity: 'Client' },
    { clientName: 'Raya Trade', type: 'RET', status: 'A', activity: 'Client' },
    { clientName: 'TBC', type: 'PRJ', status: 'A', activity: 'Client' },
    { clientName: 'Wander', type: 'RET', status: 'A', activity: 'Client' },
  ];

  for (const client of clients) {
    await prisma.clientData.create({
      data: client,
    });
  }

  // Create Page Permissions
  const pagePermissions = [
    { user: 'aley', page: 'Data Entry', access: 'SHOW' },
    { user: 'aley', page: 'Consultant Toolkit', access: 'SHOW' },
    { user: 'aley', page: 'Settings', access: 'SHOW' },
    { user: 'islam', page: 'Consultant Toolkit', access: 'SHOW' },
    { user: 'islam', page: 'Settings', access: 'SHOW' },
    { user: 'islam', page: 'Data Entry', access: 'SHOW' },
  ];

  for (const permission of pagePermissions) {
    await prisma.pagePermission.create({
      data: permission,
    });
  }

  // Create User Domains (assign users to all domains for now)
  const userDomainAssignments = [
    'aley', 'islam', 'momen', 'youssef', 'galal', 'magdy', 'raneem'
  ];

  for (const username of userDomainAssignments) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user) {
      for (let domainId = 1; domainId <= 5; domainId++) {
        await prisma.userDomain.create({
          data: {
            userId: user.id,
            username: username,
            domainId: domainId,
          },
        });
      }
    }
  }

  // Create Sample Consultant Deals for 2025
  const consultants = [
    { id: 1000, name: 'islam', role: 'CONSULTANT' },
    { id: 1001, name: 'youssef', role: 'CONSULTANT' },
    { id: 1002, name: 'momen', role: 'CONSULTANT' },
    { id: 1003, name: 'aley', role: 'CONSULTANT' },
    { id: 1004, name: 'marwa', role: 'SUPPORTING' },
    { id: 1005, name: 'reem', role: 'SUPPORTING' },
    { id: 1006, name: 'magdy', role: 'CONSULTANT' },
    { id: 1007, name: 'galal', role: 'CONSULTANT' },
  ];

  for (const consultant of consultants) {
    for (let month = 1; month <= 12; month++) {
      await prisma.consultantDeal.create({
        data: {
          year: 2025,
          month: month,
          consultantId: consultant.id,
          consultant: consultant.name,
          dealDays: consultant.role === 'SUPPORTING' ? 10 : 20,
          role: consultant.role,
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });