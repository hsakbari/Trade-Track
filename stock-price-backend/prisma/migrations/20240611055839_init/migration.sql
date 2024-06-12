/*
  Warnings:

  - You are about to alter the column `price` on the `stock` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- DropIndex
DROP INDEX `Stock_symbol_key` ON `stock`;

-- AlterTable
ALTER TABLE `stock` MODIFY `price` DOUBLE NOT NULL;
