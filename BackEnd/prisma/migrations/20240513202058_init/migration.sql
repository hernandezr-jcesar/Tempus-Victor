/*
  Warnings:

  - You are about to drop the column `pomodoroId` on the `task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[taskId]` on the table `PomodoroSession` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_pomodoroId_fkey`;

-- AlterTable
ALTER TABLE `pomodorosession` ADD COLUMN `taskId` INTEGER NULL;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `pomodoroId`;

-- CreateIndex
CREATE UNIQUE INDEX `PomodoroSession_taskId_key` ON `PomodoroSession`(`taskId`);

-- AddForeignKey
ALTER TABLE `PomodoroSession` ADD CONSTRAINT `PomodoroSession_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`idTask`) ON DELETE SET NULL ON UPDATE CASCADE;
