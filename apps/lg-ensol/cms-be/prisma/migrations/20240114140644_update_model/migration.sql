-- AlterTable
ALTER TABLE `Facility` MODIFY `iconColor` VARCHAR(191) NULL DEFAULT '#a8c410',
    MODIFY `fontSize` INTEGER NULL DEFAULT 18;

-- AlterTable
ALTER TABLE `Section` MODIFY `color` VARCHAR(191) NULL DEFAULT '#D2C60C',
    MODIFY `strokeAlpha` INTEGER NULL DEFAULT 30,
    MODIFY `strokeColor` VARCHAR(191) NULL DEFAULT '#D2C60C',
    MODIFY `strokeWidth` INTEGER NULL DEFAULT 5;
