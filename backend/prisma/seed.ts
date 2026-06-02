import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@university.local',
    },
  });

  if (existingAdmin) {
    console.log('Root admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  await prisma.user.create({
    data: {
      email: 'admin@university.local',

      password: hashedPassword,

      role: UserRole.ADMIN,
    },
  });

  console.log('Root admin created successfully');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
