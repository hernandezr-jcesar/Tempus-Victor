-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_pomodoroId_fkey`;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_pomodoroId_fkey` FOREIGN KEY (`pomodoroId`) REFERENCES `PomodoroSession`(`idPomodoro`) ON DELETE CASCADE ON UPDATE CASCADE;
