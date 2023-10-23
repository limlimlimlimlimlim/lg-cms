-- DropIndex
DROP INDEX `Map_floorId_fkey` ON `Map`;

-- AddForeignKey
ALTER TABLE `Map` ADD CONSTRAINT `Map_floorId_fkey` FOREIGN KEY (`floorId`) REFERENCES `Floor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;