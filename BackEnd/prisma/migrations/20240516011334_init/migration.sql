/*
  Warnings:

  - You are about to drop the column `imagenAbandono` on the `setting` table. All the data in the column will be lost.
  - You are about to drop the column `imagenDescanso` on the `setting` table. All the data in the column will be lost.
  - You are about to drop the column `imagenTrabajo` on the `setting` table. All the data in the column will be lost.
  - Added the required column `alarmSound` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `breakImg` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neglectedImg` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tictacSound` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workImg` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `setting` DROP COLUMN `imagenAbandono`,
    DROP COLUMN `imagenDescanso`,
    DROP COLUMN `imagenTrabajo`,
    ADD COLUMN `alarmSound` INTEGER NOT NULL,
    ADD COLUMN `breakImg` INTEGER NOT NULL,
    ADD COLUMN `neglectedImg` INTEGER NOT NULL,
    ADD COLUMN `tictacSound` INTEGER NOT NULL,
    ADD COLUMN `workImg` INTEGER NOT NULL;
