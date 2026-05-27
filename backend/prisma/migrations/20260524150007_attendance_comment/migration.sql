-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `comment` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PRESENT', 'LATE', 'ABSENT', 'EXCUSED') NOT NULL;

-- AlterTable
ALTER TABLE `attendancechangelog` MODIFY `oldStatus` ENUM('PRESENT', 'LATE', 'ABSENT', 'EXCUSED') NULL,
    MODIFY `newStatus` ENUM('PRESENT', 'LATE', 'ABSENT', 'EXCUSED') NOT NULL;
