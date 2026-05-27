/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PrismaClient,
  LessonType,
  WeekDay,
  AttendanceStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // =========================================
  // GROUPS
  // =========================================

  const group1 = await prisma.academicGroup.create({
    data: {
      name: '251003',
    },
  });

  const group2 = await prisma.academicGroup.create({
    data: {
      name: '251004',
    },
  });

  // =========================================
  // SUBJECTS
  // =========================================

  const programming = await prisma.subject.create({
    data: {
      name: 'Программирование',
    },
  });

  const databases = await prisma.subject.create({
    data: {
      name: 'Базы данных',
    },
  });

  // =========================================
  // ROOMS
  // =========================================

  const room312 = await prisma.room.create({
    data: {
      name: '312',
    },
  });

  const room210 = await prisma.room.create({
    data: {
      name: '210',
    },
  });

  // =========================================
  // PAIR TIMES
  // =========================================

  const pair1 = await prisma.pairTime.create({
    data: {
      pairNumber: 1,

      startTime: '10:00',

      endTime: '11:30',
    },
  });

  const pair2 = await prisma.pairTime.create({
    data: {
      pairNumber: 2,

      startTime: '12:00',

      endTime: '13:30',
    },
  });

  // =========================================
  // TEACHER
  // =========================================

  const teacher = await prisma.teacher.findFirst();

  if (!teacher) {
    throw new Error('Teacher not found');
  }

  // =========================================
  // STUDENTS
  // =========================================

  // ======================================================
  // TEST STUDENTS
  // ======================================================

  const student1 = await prisma.student.upsert({
    where: {
      studentCardNo: 'ST001',
    },

    update: {},

    create: {
      fullName: 'Иван Иванов',
      studentCardNo: 'ST001',
      groupId: 1,
    },
  });

  const student2 = await prisma.student.upsert({
    where: {
      studentCardNo: 'ST002',
    },

    update: {},

    create: {
      fullName: 'Петр Петров',
      studentCardNo: 'ST002',
      groupId: 1,
    },
  });

  const student3 = await prisma.student.upsert({
    where: {
      studentCardNo: 'ST003',
    },

    update: {},

    create: {
      fullName: 'Алексей Смирнов',
      studentCardNo: 'ST003',
      groupId: 1,
    },
  });

  // ======================================================
  // TEST LESSON SESSION
  // ======================================================

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const session = await prisma.lessonSession.upsert({
    where: {
      id: 1,
    },

    update: {},

    create: {
      lessonDate: today,

      lessonType: 'LECTURE',

      subjectId: 1,

      teacherId: 5,

      roomId: 1,

      pairTimeId: 1,

      groupId: 1,
    },
  });

  // ======================================================
  // ATTENDANCE
  // ======================================================

  await prisma.attendance.upsert({
    where: {
      studentId_lessonSessionId: {
        studentId: student1.id,
        lessonSessionId: session.id,
      },
    },

    update: {},

    create: {
      studentId: student1.id,
      lessonSessionId: session.id,
      status: 'PENDING',
    },
  });

  await prisma.attendance.upsert({
    where: {
      studentId_lessonSessionId: {
        studentId: student2.id,
        lessonSessionId: session.id,
      },
    },

    update: {},

    create: {
      studentId: student2.id,
      lessonSessionId: session.id,
      status: 'PENDING',
    },
  });

  await prisma.attendance.upsert({
    where: {
      studentId_lessonSessionId: {
        studentId: student3.id,
        lessonSessionId: session.id,
      },
    },

    update: {},

    create: {
      studentId: student3.id,
      lessonSessionId: session.id,
      status: 'PENDING',
    },
  });
  // =========================================
  // SCHEDULE TEMPLATES
  // =========================================

  await prisma.scheduleTemplate.create({
    data: {
      weekday: WeekDay.MONDAY,

      lessonType: LessonType.LECTURE,

      subjectId: programming.id,

      teacherId: teacher.id,

      roomId: room312.id,

      pairTimeId: pair1.id,

      groupId: group1.id,
    },
  });

  await prisma.scheduleTemplate.create({
    data: {
      weekday: WeekDay.MONDAY,

      lessonType: LessonType.PRACTICE,

      subjectId: databases.id,

      teacherId: teacher.id,

      roomId: room210.id,

      pairTimeId: pair2.id,

      groupId: group2.id,
    },
  });

  console.log('SEED COMPLETED');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
