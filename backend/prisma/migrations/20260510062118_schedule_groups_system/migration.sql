/*
  Warnings:

  - You are about to drop the column `groupId` on the `schedule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_groupId_fkey`;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `groupId`;

-- CreateTable
CREATE TABLE `ScheduleGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scheduleId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,

    UNIQUE INDEX `ScheduleGroup_scheduleId_groupId_key`(`scheduleId`, `groupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ScheduleGroup` ADD CONSTRAINT `ScheduleGroup_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScheduleGroup` ADD CONSTRAINT `ScheduleGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `AcademicGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
