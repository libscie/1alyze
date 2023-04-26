/*
  Warnings:

  - You are about to drop the column `main` on the `Table` table. All the data in the column will be lost.
  - Added the required column `confidence` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "values" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "main",
ADD COLUMN     "confidence" INTEGER NOT NULL,
ADD COLUMN     "values" JSONB DEFAULT '{}';
