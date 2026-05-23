/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('SEED STARTED');

  // =========================================
  // PAIR TIMES
  // =========================================

  await prisma.pairTime.createMany({
    data: [
      {
        pairNumber: 1,
        startTime: '09:00',
        endTime: '10:20',
      },

      {
        pairNumber: 2,
        startTime: '10:35',
        endTime: '11:55',
      },

      {
        pairNumber: 3,
        startTime: '12:10',
        endTime: '13:30',
      },

      {
        pairNumber: 4,
        startTime: '13:45',
        endTime: '15:05',
      },
    ],

    skipDuplicates: true,
  });

  // =========================================
  // ROOMS
  // =========================================

  await prisma.room.createMany({
    data: [{ name: '101' }, { name: '202' }, { name: '303' }],

    skipDuplicates: true,
  });

  // =========================================
  // DEVICES
  // =========================================

  const room101 = await prisma.room.findUnique({
    where: {
      name: '101',
    },
  });

  const room202 = await prisma.room.findUnique({
    where: {
      name: '202',
    },
  });

  if (room101 && room202) {
    await prisma.device.createMany({
      data: [
        {
          serialNumber: 'HK-101',
          roomId: room101.id,
        },

        {
          serialNumber: 'HK-202',
          roomId: room202.id,
        },
      ],

      skipDuplicates: true,
    });
  }

  // =========================================
  // GROUPS
  // =========================================

  await prisma.academicGroup.createMany({
    data: [{ name: '251001' }, { name: '251002' }],

    skipDuplicates: true,
  });

  const group1 = await prisma.academicGroup.findUnique({
    where: {
      name: '251001',
    },
  });

  const group2 = await prisma.academicGroup.findUnique({
    where: {
      name: '251002',
    },
  });

  // =========================================
  // SUBJECTS
  // =========================================

  await prisma.subject.createMany({
    data: [
      { name: 'Базы данных' },
      { name: 'Web-разработка' },
      { name: 'Сетевые технологии' },
    ],

    skipDuplicates: true,
  });

  const databaseSubject = await prisma.subject.findUnique({
    where: {
      name: 'Базы данных',
    },
  });

  const webSubject = await prisma.subject.findUnique({
    where: {
      name: 'Web-разработка',
    },
  });

  // =========================================
  // TEACHER
  // =========================================

  const teacherPassword = await bcrypt.hash('teacher123', 10);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: 'teacher@test.com',
    },
  });

  let teacher;

  if (!existingUser) {
    teacher = await prisma.teacher.create({
      data: {
        fullName: 'Иванов Иван Иванович',

        cardNo: 'T-001',

        user: {
          create: {
            email: 'teacher@test.com',

            password: teacherPassword,

            role: 'TEACHER',
          },
        },
      },
    });
  } else {
    teacher = await prisma.teacher.findFirst({
      where: {
        user: {
          email: 'teacher@test.com',
        },
      },
    });
  }

  // =========================================
  // STUDENTS
  // =========================================

  if (group1) {
    for (let i = 1; i <= 10; i++) {
      await prisma.student.upsert({
        where: {
          studentCardNo: `251001-${i}`,
        },

        update: {},

        create: {
          fullName: `Студент 251001-${i}`,

          studentCardNo: `251001-${i}`,

          groupId: group1.id,
        },
      });
    }
  }

  if (group2) {
    for (let i = 1; i <= 10; i++) {
      await prisma.student.upsert({
        where: {
          studentCardNo: `251002-${i}`,
        },

        update: {},

        create: {
          fullName: `Студент 251002-${i}`,

          studentCardNo: `251002-${i}`,

          groupId: group2.id,
        },
      });
    }
  }

  // =========================================
  // SCHEDULE TEMPLATE
  // =========================================

  const pair1 = await prisma.pairTime.findUnique({
    where: {
      pairNumber: 1,
    },
  });

  if (teacher && group1 && databaseSubject && room101 && pair1) {
    await prisma.scheduleTemplate.createMany({
      data: [
        {
          weekday: 'MONDAY',

          lessonType: 'LECTURE',

          subjectId: databaseSubject.id,

          teacherId: teacher.id,

          roomId: room101.id,

          pairTimeId: pair1.id,

          groupId: group1.id,
        },
      ],

      skipDuplicates: true,
    });
  }

  console.log('SEED FINISHED');
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
