/*
  Warnings:

  - You are about to drop the column `action` on the `attendancechangelog` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `attendancechangelog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attendancechangelog` DROP COLUMN `action`,
    DROP COLUMN `details`,
    ADD COLUMN `reason` VARCHAR(191) NULL;
