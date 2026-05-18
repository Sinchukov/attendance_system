/*
  Warnings:

  - You are about to drop the column `subgroupNumber` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `subgroupRequired` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the `subjectsubgroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `subjectsubgroup` DROP FOREIGN KEY `SubjectSubgroup_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `subjectsubgroup` DROP FOREIGN KEY `SubjectSubgroup_subjectId_fkey`;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `subgroupNumber`,
    DROP COLUMN `subgroupRequired`,
    ADD COLUMN `subdivisionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `subdivisionId` INTEGER NULL;

-- DropTable
DROP TABLE `subjectsubgroup`;

-- CreateTable
CREATE TABLE `GroupSubdivision` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `groupId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `GroupSubdivision_groupId_name_key`(`groupId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GroupSubdivision` ADD CONSTRAINT `GroupSubdivision_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `AcademicGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_subdivisionId_fkey` FOREIGN KEY (`subdivisionId`) REFERENCES `GroupSubdivision`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_subdivisionId_fkey` FOREIGN KEY (`subdivisionId`) REFERENCES `GroupSubdivision`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
