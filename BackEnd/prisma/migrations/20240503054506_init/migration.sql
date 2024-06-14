-- CreateTable
CREATE TABLE `User` (
    `idUser` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `idSetting` INTEGER NOT NULL AUTO_INCREMENT,
    `pomodoroWorkDuration` INTEGER NOT NULL,
    `shortBreakDuration` INTEGER NOT NULL,
    `longBreakDuration` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Setting_userId_key`(`userId`),
    PRIMARY KEY (`idSetting`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Note` (
    `idNote` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`idNote`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `idTask` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `comments` TEXT NULL,
    `deadline` DATETIME(3) NULL,
    `importance` BOOLEAN NOT NULL DEFAULT false,
    `urgency` BOOLEAN NOT NULL DEFAULT false,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,
    `categoryId` INTEGER NULL,
    `pomororoId` INTEGER NULL,

    UNIQUE INDEX `Task_pomororoId_key`(`pomororoId`),
    PRIMARY KEY (`idTask`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `idEvent` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL,
    `description` TEXT NOT NULL,
    `taskId` INTEGER NOT NULL,

    PRIMARY KEY (`idEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `idCategory` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `isPersonalized` BOOLEAN NOT NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`idCategory`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PomodoroSession` (
    `idPomodoro` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `completedPomodoros` INTEGER NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `totalTimeElapsed` INTEGER NOT NULL,
    `workTimeElapsed` INTEGER NOT NULL,
    `breakTimeElapsed` INTEGER NOT NULL,
    `estimate` INTEGER NOT NULL,

    PRIMARY KEY (`idPomodoro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PomodoroEvent` (
    `idPomodoroEvent` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL,
    `description` TEXT NOT NULL,
    `pomodoroSessionId` INTEGER NOT NULL,

    PRIMARY KEY (`idPomodoroEvent`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Setting` ADD CONSTRAINT `Setting_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`idCategory`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_pomororoId_fkey` FOREIGN KEY (`pomororoId`) REFERENCES `PomodoroSession`(`idPomodoro`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`idTask`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PomodoroEvent` ADD CONSTRAINT `PomodoroEvent_pomodoroSessionId_fkey` FOREIGN KEY (`pomodoroSessionId`) REFERENCES `PomodoroSession`(`idPomodoro`) ON DELETE CASCADE ON UPDATE CASCADE;
