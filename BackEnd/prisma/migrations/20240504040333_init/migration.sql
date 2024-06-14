/*
  Warnings:

  - Added the required column `currentBreakTime` to the `PomodoroSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentWorkTime` to the `PomodoroSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingBreakTime` to the `PomodoroSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingWorkTime` to the `PomodoroSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pomodorosession` ADD COLUMN `currentBreakTime` INTEGER NOT NULL,
    ADD COLUMN `currentWorkTime` INTEGER NOT NULL,
    ADD COLUMN `remainingBreakTime` INTEGER NOT NULL,
    ADD COLUMN `remainingWorkTime` INTEGER NOT NULL;
