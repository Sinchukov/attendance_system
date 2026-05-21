/*
  Warnings:

  - You are about to drop the column `checkOut` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `changedAt` on the `attendancechangelog` table. All the data in the column will be lost.
  - Added the required column `action` to the `AttendanceChangeLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attendancechangelog` DROP FOREIGN KEY `AttendanceChangeLog_teacherId_fkey`;

-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `checkOut`;

-- AlterTable
ALTER TABLE `attendancechangelog` DROP COLUMN `changedAt`,
    ADD COLUMN `action` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `details` VARCHAR(191) NULL,
    ADD COLUMN `deviceId` INTEGER NULL,
    MODIFY `teacherId` INTEGER NULL,
    MODIFY `oldStatus` ENUM('PRESENT', 'LATE', 'ABSENT') NULL;

-- AddForeignKey
ALTER TABLE `AttendanceChangeLog` ADD CONSTRAINT `AttendanceChangeLog_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceChangeLog` ADD CONSTRAINT `AttendanceChangeLog_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
