/*
  Warnings:

  - You are about to drop the column `subgroup` on the `schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `subgroup`,
    ADD COLUMN `subdivisionId` INTEGER NULL;

-- CreateTable
CREATE TABLE `SubjectSubdivision` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SubjectSubdivision_subjectId_groupId_name_key`(`subjectId`, `groupId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubjectSubdivisionStudent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subdivisionId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,

    UNIQUE INDEX `SubjectSubdivisionStudent_subdivisionId_studentId_key`(`subdivisionId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubjectSubdivision` ADD CONSTRAINT `SubjectSubdivision_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectSubdivision` ADD CONSTRAINT `SubjectSubdivision_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `AcademicGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectSubdivisionStudent` ADD CONSTRAINT `SubjectSubdivisionStudent_subdivisionId_fkey` FOREIGN KEY (`subdivisionId`) REFERENCES `SubjectSubdivision`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubjectSubdivisionStudent` ADD CONSTRAINT `SubjectSubdivisionStudent_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_subdivisionId_fkey` FOREIGN KEY (`subdivisionId`) REFERENCES `SubjectSubdivision`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
