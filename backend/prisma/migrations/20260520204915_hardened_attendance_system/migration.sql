-- CreateTable
CREATE TABLE `AttendanceAuditLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cardNo` VARCHAR(191) NOT NULL,
    `deviceSerial` VARCHAR(191) NOT NULL,
    `eventType` ENUM('CHECK_IN_SUCCESS', 'CHECK_OUT_SUCCESS', 'DUPLICATE_CHECK_IN', 'DUPLICATE_CHECK_OUT', 'SPAM_DETECTED', 'NO_ACTIVE_SESSION', 'STUDENT_NOT_FOUND', 'DEVICE_NOT_FOUND', 'INVALID_SESSION') NOT NULL,
    `message` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `studentId` INTEGER NULL,
    `lessonSessionId` INTEGER NULL,
    `attendanceId` INTEGER NULL,
    `deviceId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AttendanceAuditLog` ADD CONSTRAINT `AttendanceAuditLog_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceAuditLog` ADD CONSTRAINT `AttendanceAuditLog_lessonSessionId_fkey` FOREIGN KEY (`lessonSessionId`) REFERENCES `LessonSession`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceAuditLog` ADD CONSTRAINT `AttendanceAuditLog_attendanceId_fkey` FOREIGN KEY (`attendanceId`) REFERENCES `Attendance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceAuditLog` ADD CONSTRAINT `AttendanceAuditLog_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `Device`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
