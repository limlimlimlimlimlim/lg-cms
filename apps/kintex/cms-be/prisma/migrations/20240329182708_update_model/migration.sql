/*
  Warnings:

  - You are about to alter the column `network` on the `Monitoring` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `Monitoring` MODIFY `network` BOOLEAN NOT NULL DEFAULT false;
