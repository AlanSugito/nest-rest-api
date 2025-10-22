/*
  Warnings:

  - Added the required column `userId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_bookId_fkey";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
