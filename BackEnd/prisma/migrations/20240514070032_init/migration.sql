/*
  Warnings:

  - Added the required column `imagenAbandono` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagenDescanso` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagenTrabajo` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `setting` DROP FOREIGN KEY `Setting_userId_fkey`;

-- AlterTable
ALTER TABLE `setting` ADD COLUMN `imagenAbandono` INTEGER NOT NULL,
    ADD COLUMN `imagenDescanso` INTEGER NOT NULL,
    ADD COLUMN `imagenTrabajo` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Setting` ADD CONSTRAINT `Setting_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`idUser`) ON DELETE CASCADE ON UPDATE CASCADE;
