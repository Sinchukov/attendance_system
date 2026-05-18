/*
  Warnings:

  - You are about to drop the column `subdivisionId` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the `schedulegroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjectsubdivision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjectsubdivisionstudent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_subdivisionId_fkey`;

-- DropForeignKey
ALTER TABLE `schedulegroup` DROP FOREIGN KEY `ScheduleGroup_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `schedulegroup` DROP FOREIGN KEY `ScheduleGroup_scheduleId_fkey`;

-- DropForeignKey
ALTER TABLE `subjectsubdivision` DROP FOREIGN KEY `SubjectSubdivision_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `subjectsubdivision` DROP FOREIGN KEY `SubjectSubdivision_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `subjectsubdivisionstudent` DROP FOREIGN KEY `SubjectSubdivisionStudent_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `subjectsubdivisionstudent` DROP FOREIGN KEY `SubjectSubdivisionStudent_subdivisionId_fkey`;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `subdivisionId`,
    ADD COLUMN `groupId` INTEGER NOT NULL,
    ADD COLUMN `subgroup` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `schedulegroup`;

-- DropTable
DROP TABLE `subjectsubdivision`;

-- DropTable
DROP TABLE `subjectsubdivisionstudent`;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `AcademicGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
