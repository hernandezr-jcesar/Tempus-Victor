-- DropForeignKey
ALTER TABLE `pomodorosession` DROP FOREIGN KEY `PomodoroSession_taskId_fkey`;

-- AddForeignKey
ALTER TABLE `PomodoroSession` ADD CONSTRAINT `PomodoroSession_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`idTask`) ON DELETE CASCADE ON UPDATE CASCADE;
