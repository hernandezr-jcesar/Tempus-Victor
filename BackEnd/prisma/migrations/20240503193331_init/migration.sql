/*
  Warnings:

  - You are about to drop the column `pomororoId` on the `task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pomodoroId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_pomororoId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `pomororoId`,
    ADD COLUMN `pomodoroId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Task_pomodoroId_key` ON `Task`(`pomodoroId`);

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_pomodoroId_fkey` FOREIGN KEY (`pomodoroId`) REFERENCES `PomodoroSession`(`idPomodoro`) ON DELETE SET NULL ON UPDATE CASCADE;
