/*
  Warnings:

  - You are about to drop the column `reason` on the `attendancechangelog` table. All the data in the column will be lost.
  - Added the required column `action` to the `AttendanceChangeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendancechangelog` DROP COLUMN `reason`,
    ADD COLUMN `action` VARCHAR(191) NOT NULL,
    ADD COLUMN `details` VARCHAR(191) NULL;
