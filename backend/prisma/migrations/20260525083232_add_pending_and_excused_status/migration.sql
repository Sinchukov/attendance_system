-- AlterTable
ALTER TABLE `attendance` MODIFY `status` ENUM('PENDING', 'PRESENT', 'LATE', 'ABSENT', 'EXCUSED') NOT NULL;

-- AlterTable
ALTER TABLE `attendancechangelog` MODIFY `oldStatus` ENUM('PENDING', 'PRESENT', 'LATE', 'ABSENT', 'EXCUSED') NULL,
    MODIFY `newStatus` ENUM('PENDING', 'PRESENT', 'LATE', 'ABSENT', 'EXCUSED') NOT NULL;
